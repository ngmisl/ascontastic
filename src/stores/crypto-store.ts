import { create } from 'zustand';
import { AsconCrypto } from '@/lib/crypto/ascon-crypto';
import type { Contact, EncryptionMode } from '@/types/crypto';

interface CryptoState {
  // Crypto instance
  crypto: AsconCrypto;
  
  // Key management
  hasKey: boolean;
  
  // Contacts
  contacts: Contact[];
  
  // UI state
  currentMode: EncryptionMode;
  selectedContactId: string;
  
  // Actions
  generateKey: () => void;
  addContact: (name: string, keyHex: string) => void;
  removeContact: (id: string) => void;
  setEncryptionMode: (mode: EncryptionMode) => void;
  setSelectedContact: (contactId: string) => void;
  refreshContacts: () => void;
  clearAll: () => void;
}

export const useCryptoStore = create<CryptoState>((set, get) => {
  const cryptoInstance = new AsconCrypto();

  return {
    crypto: cryptoInstance,
    hasKey: cryptoInstance.getKey() !== null,
    contacts: cryptoInstance.getContacts(),
    currentMode: 'password',
    selectedContactId: '',

    generateKey: () => {
      const { crypto } = get();
      crypto.generateKey();
      set({ hasKey: true });
    },

    addContact: (name: string, keyHex: string) => {
      const { crypto } = get();
      crypto.addContact(name, keyHex);
      set({ contacts: crypto.getContacts() });
    },

    removeContact: (id: string) => {
      const { crypto, selectedContactId } = get();
      if (crypto.removeContact(id)) {
        const newSelectedId = selectedContactId === id ? '' : selectedContactId;
        set({ 
          contacts: crypto.getContacts(),
          selectedContactId: newSelectedId
        });
      }
    },

    setEncryptionMode: (mode: EncryptionMode) => {
      set({ currentMode: mode, selectedContactId: '' });
    },

    setSelectedContact: (contactId: string) => {
      set({ selectedContactId: contactId });
    },

    refreshContacts: () => {
      const { crypto } = get();
      set({ 
        contacts: crypto.getContacts(),
        hasKey: crypto.getKey() !== null
      });
    },

    clearAll: () => {
      const { crypto } = get();
      crypto.clearAll();
      set({
        hasKey: false,
        contacts: [],
        selectedContactId: '',
        currentMode: 'password'
      });
    }
  };
});