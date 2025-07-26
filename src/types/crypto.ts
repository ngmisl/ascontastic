export interface Contact {
  id: string;
  name: string;
  keyHex: string;
  added: string;
}

export interface AsconKeyPair {
  key: Uint8Array;
  salt?: Uint8Array;
}

export interface EncryptionResult {
  ciphertext: string;
  metadata?: {
    recipient?: string;
    timestamp: Date;
    size: number;
  };
}

export interface DecryptionResult {
  plaintext: string;
  metadata?: {
    timestamp: Date;
  };
}

export type EncryptionMode = 'contact' | 'mykey' | 'password';

export interface CryptoError extends Error {
  code: 'INVALID_KEY' | 'ENCRYPTION_FAILED' | 'DECRYPTION_FAILED' | 'INVALID_INPUT';
}

export interface StorageState {
  asconKey: string | null;
  contacts: Contact[];
}