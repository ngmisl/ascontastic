import { Ascon, randomBytes } from 'ascon-js';
import type { Contact, AsconKeyPair, EncryptionResult, DecryptionResult, CryptoError, StorageState, EncryptedStorageState } from '@/types/crypto';

export class AsconCrypto {
  private asconKey: Uint8Array | null = null;
  private contacts: Contact[] = [];
  private masterKey: CryptoKey | null = null;
  private masterKeySalt: Uint8Array | null = null;

  constructor() {
    this.loadStateFromStorage();
  }

  /**
   * Generate Ascon-80pq key (20 bytes for 160-bit security)
   */
  async generateKey(): Promise<Uint8Array> {
    this.asconKey = randomBytes(20);
    await this.saveState();
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
  async addContact(name: string, keyHex: string): Promise<Contact> {
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
    await this.saveState();
    return contact;
  }

  /**
   * Remove a contact by ID
   */
  async removeContact(id: string): Promise<boolean> {
    const initialLength = this.contacts.length;
    this.contacts = this.contacts.filter(c => c.id !== id);
    
    if (this.contacts.length < initialLength) {
      await this.saveState();
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
  async importKey(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      if (data.ascon80pqKey && typeof data.ascon80pqKey === 'string') {
        this.asconKey = this.hexToArrayBuffer(data.ascon80pqKey);
        await this.saveState();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Export contacts as JSON
   */
  exportContacts(): string | null {
    if (this.contacts.length === 0) {
      return null;
    }
    const exportData = {
      contacts: this.contacts,
      exported: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import contacts from JSON
   */
  async importContacts(jsonData: string): Promise<{
    imported: number,
    duplicates: number
  }> {
    let imported = 0;
    let duplicates = 0;
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data.contacts)) {
        for (const contact of data.contacts) {
          if (contact.name && contact.keyHex) {
            const nameExists = this.contacts.some(c => c.name.toLowerCase() === contact.name.toLowerCase());
            const keyExists = this.contacts.some(c => c.keyHex === contact.keyHex);

            if (!nameExists && !keyExists) {
              this.contacts.push({
                id: Date.now().toString() + imported,
                name: contact.name,
                keyHex: contact.keyHex,
                added: contact.added || new Date().toISOString()
              });
              imported++;
            } else {
              duplicates++;
            }
          }
        }
        if (imported > 0) {
          await this.saveState();
        }
      }
    } catch (error) {
      console.error("Contact import failed:", error);
      throw this.createCryptoError('INVALID_INPUT', 'Invalid contacts file format.');
    }
    return { imported, duplicates };
  }

  /**
   * Clear all data and keys (secure wipe)
   */
  clearAll(): void {
    // Securely wipe keys from memory
    if (this.asconKey) {
      this.asconKey.fill(0);
    }
    this.asconKey = null;
    this.masterKey = null;
    this.masterKeySalt = null;

    this.contacts = [];
    
    // Clear local storage
    try {
      localStorage.removeItem('ascon80pq_vault');
    } catch (error) {
      console.warn('Failed to clear local storage:', error);
    }
  }

  /**
   * State management - encrypted in local storage
   */
  async saveState(): Promise<void> {
    if (!this.masterKey) {
      throw this.createCryptoError('ENCRYPTION_FAILED', 'Master key is not set. Cannot save state.');
    }

    const state: StorageState = {
      asconKey: this.asconKey ? this.arrayBufferToHex(this.asconKey) : null,
      contacts: this.contacts,
    };

    const iv = randomBytes(12); // 96-bit IV for AES-GCM
    const plaintext = new TextEncoder().encode(JSON.stringify(state));

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.masterKey,
      plaintext
    );

    const vault: EncryptedStorageState = {
      salt: this.arrayBufferToHex(this.masterKeySalt!),
      iv: this.arrayBufferToHex(iv),
      data: this.arrayBufferToBase64(new Uint8Array(encryptedData)),
    };

    try {
      localStorage.setItem('ascon80pq_vault', JSON.stringify(vault));
    } catch (error) {
      throw this.createCryptoError('ENCRYPTION_FAILED', `Failed to save state to local storage: ${error}`);
    }
  }

  private loadStateFromStorage(): void {
    try {
      const vaultString = localStorage.getItem('ascon80pq_vault');
      if (vaultString) {
        const vault: EncryptedStorageState = JSON.parse(vaultString);
        this.masterKeySalt = this.hexToArrayBuffer(vault.salt);
      }
    } catch (error) {
      console.error('Failed to load vault from storage:', error);
      this.clearAll();
    }
  }

  async unlock(password: string): Promise<boolean> {
    if (!this.masterKeySalt) {
      // New vault, generate salt and derive key
      this.masterKeySalt = randomBytes(16);
    }

    try {
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );

      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: this.masterKeySalt,
          iterations: 300000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      this.masterKey = derivedKey;

      // If vault exists, try to decrypt it
      const vaultString = localStorage.getItem('ascon80pq_vault');
      if (vaultString) {
        return await this.loadState();
      }

      return true; // Unlocked for new vault creation
    } catch (error) {
      this.masterKey = null;
      console.error('Unlocking failed:', error);
      return false;
    }
  }

  private async loadState(): Promise<boolean> {
    if (!this.masterKey) return false;

    try {
      const vaultString = localStorage.getItem('ascon80pq_vault');
      if (!vaultString) return false;

      const vault: EncryptedStorageState = JSON.parse(vaultString);
      const iv = this.hexToArrayBuffer(vault.iv);
      const data = this.base64ToArrayBuffer(vault.data);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.masterKey,
        data
      );

      const state: StorageState = JSON.parse(new TextDecoder().decode(decrypted));
      this.asconKey = state.asconKey ? this.hexToArrayBuffer(state.asconKey) : null;
      this.contacts = state.contacts || [];
      return true;
    } catch (error) {
      console.error('Failed to load and decrypt state:', error);
      this.clearAll(); // Clear corrupted data
      return false;
    }
  }

  isLocked(): boolean {
    return this.hasVault() && this.masterKey === null;
  }

  hasVault(): boolean {
    try {
      return localStorage.getItem('ascon80pq_vault') !== null;
    } catch {
      return false;
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