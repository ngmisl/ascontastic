import { create } from 'zustand';
import { AsconCrypto } from '@/lib/crypto/ascon-crypto';
import type { Contact, EncryptionMode } from '@/types/crypto';

interface CryptoState {
  // Crypto instance
  crypto: AsconCrypto;
  
  // Vault state
  isLocked: boolean;
  hasVault: boolean;
  isInitialized: boolean;

  // Key management
  hasKey: boolean;
  
  // Contacts
  contacts: Contact[];
  
  // UI state
  currentMode: EncryptionMode;
  selectedContactId: string;
  
  // Actions
  initialize: () => void;
  unlock: (password: string) => Promise<boolean>;
  generateKey: () => Promise<void>;
  addContact: (name: string, keyHex: string) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  setEncryptionMode: (mode: EncryptionMode) => void;
  setSelectedContact: (contactId: string) => void;
  clearAll: () => void;
  importKey: (keyData: string) => Promise<boolean>;
  exportContacts: () => string | null;
  importContacts: (jsonData: string) => Promise<{ imported: number, duplicates: number }>;
}

export const useCryptoStore = create<CryptoState>((set, get) => {
  const cryptoInstance = new AsconCrypto();

  const refreshState = () => {
    const { crypto } = get();
    set({
      hasKey: crypto.getKey() !== null,
      contacts: crypto.getContacts(),
      isLocked: crypto.isLocked(),
      hasVault: crypto.hasVault(),
    });
  };

  return {
    crypto: cryptoInstance,
    isLocked: true,
    hasVault: false,
    isInitialized: false,
    hasKey: false,
    contacts: [],
    currentMode: 'password',
    selectedContactId: '',

    initialize: () => {
      refreshState();
      set({ isInitialized: true });
    },

    unlock: async (password: string) => {
      const { crypto } = get();
      const success = await crypto.unlock(password);
      if (success) {
        refreshState();
      }
      return success;
    },

    generateKey: async () => {
      const { crypto } = get();
      await crypto.generateKey();
      refreshState();
    },

    addContact: async (name: string, keyHex: string) => {
      const { crypto } = get();
      await crypto.addContact(name, keyHex);
      refreshState();
    },

    removeContact: async (id: string) => {
      const { crypto, selectedContactId } = get();
      if (await crypto.removeContact(id)) {
        const newSelectedId = selectedContactId === id ? '' : selectedContactId;
        set({ selectedContactId: newSelectedId });
        refreshState();
      }
    },

    setEncryptionMode: (mode: EncryptionMode) => {
      set({ currentMode: mode, selectedContactId: '' });
    },

    setSelectedContact: (contactId: string) => {
      set({ selectedContactId: contactId });
    },

    importKey: async (keyData: string) => {
      const { crypto } = get();
      const success = await crypto.importKey(keyData);
      if (success) {
        refreshState();
      }
      return success;
    },

    exportContacts: () => {
      const { crypto } = get();
      return crypto.exportContacts();
    },

    importContacts: async (jsonData: string) => {
      const { crypto } = get();
      const result = await crypto.importContacts(jsonData);
      if (result.imported > 0) {
        refreshState();
      }
      return result;
    },

    clearAll: () => {
      const { crypto } = get();
      crypto.clearAll();
      set({
        hasKey: false,
        contacts: [],
        selectedContactId: '',
        currentMode: 'password',
        isLocked: true,
        hasVault: false
      });
    }
  };
});