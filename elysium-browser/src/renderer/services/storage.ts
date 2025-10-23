import CryptoJS from 'crypto-js';
import { Session, Memory, SettingsState } from '../types';

/**
 * Storage Service
 * Handles local storage with optional encryption
 */

const STORAGE_KEYS = {
  SESSIONS: 'elysium_sessions',
  MEMORIES: 'elysium_memories',
  SETTINGS: 'elysium_settings',
  ENCRYPTION_KEY: 'elysium_key',
} as const;

export class StorageService {
  private static encryptionKey: string | null = null;

  /**
   * Initialize encryption key
   */
  static async initialize(): Promise<void> {
    try {
      let key = localStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEY);

      if (!key) {
        // Generate new encryption key
        key = CryptoJS.lib.WordArray.random(32).toString();
        localStorage.setItem(STORAGE_KEYS.ENCRYPTION_KEY, key);
      }

      this.encryptionKey = key;
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
    }
  }

  /**
   * Encrypt data
   */
  private static encrypt(data: string): string {
    if (!this.encryptionKey) {
      return data; // Fallback to unencrypted
    }
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  /**
   * Decrypt data
   */
  private static decrypt(encryptedData: string): string {
    if (!this.encryptionKey) {
      return encryptedData;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return encryptedData;
    }
  }

  /**
   * Save sessions
   */
  static async saveSessions(sessions: Session[]): Promise<void> {
    try {
      const data = JSON.stringify(sessions);
      const encrypted = this.encrypt(data);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, encrypted);

      // Also save via Electron for persistence
      if (window.electron?.storage) {
        await window.electron.storage.save(STORAGE_KEYS.SESSIONS, encrypted);
      }
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  }

  /**
   * Load sessions
   */
  static async loadSessions(): Promise<Session[]> {
    try {
      let encrypted = localStorage.getItem(STORAGE_KEYS.SESSIONS);

      // Try Electron storage if local storage is empty
      if (!encrypted && window.electron?.storage) {
        encrypted = await window.electron.storage.load(STORAGE_KEYS.SESSIONS);
      }

      if (!encrypted) {
        return [];
      }

      const decrypted = this.decrypt(encrypted);
      const sessions = JSON.parse(decrypted);

      // Convert date strings back to Date objects
      return sessions.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp),
        memories: s.memories.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      }));
    } catch (error) {
      console.error('Failed to load sessions:', error);
      return [];
    }
  }

  /**
   * Save memories
   */
  static async saveMemories(memories: Memory[]): Promise<void> {
    try {
      const data = JSON.stringify(memories);
      const encrypted = this.encrypt(data);
      localStorage.setItem(STORAGE_KEYS.MEMORIES, encrypted);

      if (window.electron?.storage) {
        await window.electron.storage.save(STORAGE_KEYS.MEMORIES, encrypted);
      }
    } catch (error) {
      console.error('Failed to save memories:', error);
    }
  }

  /**
   * Load memories
   */
  static async loadMemories(): Promise<Memory[]> {
    try {
      let encrypted = localStorage.getItem(STORAGE_KEYS.MEMORIES);

      if (!encrypted && window.electron?.storage) {
        encrypted = await window.electron.storage.load(STORAGE_KEYS.MEMORIES);
      }

      if (!encrypted) {
        return [];
      }

      const decrypted = this.decrypt(encrypted);
      const memories = JSON.parse(decrypted);

      return memories.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
    } catch (error) {
      console.error('Failed to load memories:', error);
      return [];
    }
  }

  /**
   * Save settings
   */
  static async saveSettings(settings: SettingsState): Promise<void> {
    try {
      const data = JSON.stringify(settings);
      localStorage.setItem(STORAGE_KEYS.SETTINGS, data);

      if (window.electron?.storage) {
        await window.electron.storage.save(STORAGE_KEYS.SETTINGS, data);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * Load settings
   */
  static async loadSettings(): Promise<SettingsState | null> {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      if (!data && window.electron?.storage) {
        data = await window.electron.storage.load(STORAGE_KEYS.SETTINGS);
      }

      if (!data) {
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }

  /**
   * Clear all data
   */
  static async clearAll(): Promise<void> {
    localStorage.clear();

    if (window.electron?.storage) {
      await Promise.all([
        window.electron.storage.delete(STORAGE_KEYS.SESSIONS),
        window.electron.storage.delete(STORAGE_KEYS.MEMORIES),
        window.electron.storage.delete(STORAGE_KEYS.SETTINGS),
      ]);
    }
  }
}
