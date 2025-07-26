import { Ascon, randomBytes } from 'ascon-js';
import type { Contact, AsconKeyPair, EncryptionResult, DecryptionResult, CryptoError, StorageState } from '@/types/crypto';

export class AsconCrypto {
  private asconKey: Uint8Array | null = null;
  private contacts: Contact[] = [];

  constructor() {
    this.loadState();
  }

  /**
   * Generate Ascon-80pq key (20 bytes for 160-bit security)
   */
  generateKey(): Uint8Array {
    this.asconKey = randomBytes(20);
    this.saveState();
    return this.asconKey;
  }

  /**
   * Get current Ascon key
   */
  getKey(): Uint8Array | null {
    return this.asconKey;
  }

  /**
   * Encrypt with Ascon-80pq
   */
  encrypt(key: Uint8Array, plaintext: string): string {
    try {
      const nonce = randomBytes(16);
      const data = new TextEncoder().encode(plaintext);
      
      const ciphertext = Ascon.encrypt(key, nonce, data, {
        variant: "Ascon-80pq"
      });

      // Combine nonce + ciphertext for transmission
      const result = new Uint8Array(nonce.length + ciphertext.length);
      result.set(nonce, 0);
      result.set(ciphertext, nonce.length);
      
      return this.arrayBufferToBase64(result);
    } catch (error) {
      throw this.createCryptoError('ENCRYPTION_FAILED', `Encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt with Ascon-80pq
   */
  decrypt(key: Uint8Array, encryptedData: string): string {
    try {
      const data = this.base64ToArrayBuffer(encryptedData);
      
      if (data.length < 32) {
        throw this.createCryptoError('INVALID_INPUT', 'Invalid ciphertext length');
      }

      const nonce = data.slice(0, 16);
      const ciphertext = data.slice(16);

      const decrypted = Ascon.decrypt(key, nonce, ciphertext, {
        variant: "Ascon-80pq"
      });

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      throw this.createCryptoError('DECRYPTION_FAILED', `Decryption failed: ${error}`);
    }
  }

  /**
   * Password-based key derivation with random salt
   */
  async deriveKey(password: string): Promise<AsconKeyPair> {
    try {
      const salt = randomBytes(16); // Random salt per encryption
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );

      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 250000, // High iteration count for security
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 160 },
        true,
        ['encrypt']
      );

      const keyBuffer = await window.crypto.subtle.exportKey('raw', derivedKey);
      return { key: new Uint8Array(keyBuffer), salt };
    } catch (error) {
      throw this.createCryptoError('ENCRYPTION_FAILED', `Key derivation failed: ${error}`);
    }
  }

  /**
   * Add a contact with validation
   */
  addContact(name: string, keyHex: string): Contact {
    if (!name.trim()) {
      throw this.createCryptoError('INVALID_INPUT', 'Contact name is required');
    }

    if (keyHex.length !== 40 || !/^[0-9a-fA-F]+$/.test(keyHex)) {
      throw this.createCryptoError('INVALID_KEY', 'Key must be exactly 40 hex characters');
    }
    
    // Check for duplicate names
    if (this.contacts.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      throw this.createCryptoError('INVALID_INPUT', 'Contact name already exists');
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: name.trim(),
      keyHex,
      added: new Date().toISOString()
    };
    
    this.contacts.push(contact);
    this.saveState();
    return contact;
  }

  /**
   * Remove a contact by ID
   */
  removeContact(id: string): boolean {
    const initialLength = this.contacts.length;
    this.contacts = this.contacts.filter(c => c.id !== id);
    
    if (this.contacts.length < initialLength) {
      this.saveState();
      return true;
    }
    
    return false;
  }

  /**
   * Get all contacts
   */
  getContacts(): Contact[] {
    return [...this.contacts];
  }

  /**
   * Find contact by ID
   */
  findContact(id: string): Contact | undefined {
    return this.contacts.find(c => c.id === id);
  }

  /**
   * Calculate message size for Meshtastic constraints
   */
  calculateMessageSize(message: string): { 
    messageBytes: number; 
    encodedBytes: number; 
    status: 'ok' | 'warning' | 'error' 
  } {
    const messageBytes = new TextEncoder().encode(message).length;
    const totalSize = Math.ceil((messageBytes + 32) * 4/3); // Ascon overhead + base64
    
    let status: 'ok' | 'warning' | 'error';
    if (totalSize <= 200) {
      status = 'ok';
    } else if (totalSize <= 237) {
      status = 'warning';
    } else {
      status = 'error';
    }

    return {
      messageBytes,
      encodedBytes: totalSize,
      status
    };
  }

  /**
   * Export key as JSON
   */
  exportKey(): string | null {
    if (!this.asconKey) {
      return null;
    }

    const exportData = { 
      ascon80pqKey: this.arrayBufferToHex(this.asconKey),
      exported: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import key from JSON
   */
  importKey(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.ascon80pqKey && typeof data.ascon80pqKey === 'string') {
        this.asconKey = this.hexToArrayBuffer(data.ascon80pqKey);
        this.saveState();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Clear all data and keys (secure wipe)
   */
  clearAll(): void {
    // Securely wipe key from memory
    if (this.asconKey) {
      this.asconKey.fill(0);
      this.asconKey = null;
    }
    
    this.contacts = [];
    
    // Clear session storage
    try {
      sessionStorage.removeItem('ascon80pq_key');
      sessionStorage.removeItem('ascon80pq_contacts');
    } catch (error) {
      console.warn('Failed to clear session storage:', error);
    }
  }

  /**
   * State management - session only for security
   */
  private saveState(): void {
    try {
      if (this.asconKey) {
        sessionStorage.setItem('ascon80pq_key', this.arrayBufferToHex(this.asconKey));
      }
      sessionStorage.setItem('ascon80pq_contacts', JSON.stringify(this.contacts));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  private loadState(): void {
    try {
      const keyHex = sessionStorage.getItem('ascon80pq_key');
      if (keyHex) {
        this.asconKey = this.hexToArrayBuffer(keyHex);
      }
      
      const contactsJson = sessionStorage.getItem('ascon80pq_contacts');
      if (contactsJson) {
        this.contacts = JSON.parse(contactsJson);
      }
    } catch (error) {
      console.error('Failed to load state:', error);
      this.contacts = [];
    }
  }

  /**
   * Utility functions
   */
  arrayBufferToBase64(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...buffer));
  }

  base64ToArrayBuffer(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  }

  arrayBufferToHex(buffer: Uint8Array): string {
    return Array.from(buffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  hexToArrayBuffer(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) {
      throw this.createCryptoError('INVALID_INPUT', 'Invalid hex string length');
    }
    
    const bytes = hex.match(/.{1,2}/g);
    if (!bytes) {
      throw this.createCryptoError('INVALID_INPUT', 'Invalid hex string format');
    }
    
    return new Uint8Array(bytes.map(byte => parseInt(byte, 16)));
  }

  private createCryptoError(code: CryptoError['code'], message: string): CryptoError {
    const error = new Error(message) as CryptoError;
    error.code = code;
    return error;
  }
}