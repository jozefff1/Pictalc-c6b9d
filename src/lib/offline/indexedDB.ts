import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { IDB_CONFIG } from '../utils/constants';
import type { Message, CommunicationSession } from '@/types/models';

/**
 * IndexedDB schema definition
 */
interface PictalkDB extends DBSchema {
  messages: {
    key: string;
    value: Message;
    indexes: { 'by-sender': string; 'by-recipient': string; 'by-created': Date };
  };
  sessions: {
    key: string;
    value: CommunicationSession;
    indexes: { 'by-user': string; 'by-timestamp': Date };
  };
  sync_queue: {
    key: string;
    value: QueueItem;
    indexes: { 'by-type': string; 'by-created': Date };
  };
  metadata: {
    key: string;
    value: MetadataValue;
  };
}

export type MetadataValue = string | number | boolean | Date | Record<string, unknown> | unknown[] | null;

export interface QueueItem<T = unknown> {
  id: string;
  type: 'message' | 'session' | 'pairing' | 'preference';
  action: 'create' | 'update' | 'delete';
  data: T;
  createdAt: Date;
  retryCount: number;
}

class IndexedDBService {
  private db: IDBPDatabase<PictalkDB> | null = null;

  /**
   * Initialize the IndexedDB database
   */
  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<PictalkDB>(IDB_CONFIG.NAME, IDB_CONFIG.VERSION, {
      upgrade(db) {
        // Messages store
        if (!db.objectStoreNames.contains(IDB_CONFIG.STORES.MESSAGES)) {
          const messageStore = db.createObjectStore(IDB_CONFIG.STORES.MESSAGES, {
            keyPath: 'id',
          });
          messageStore.createIndex('by-sender', 'senderId');
          messageStore.createIndex('by-recipient', 'recipientId');
          messageStore.createIndex('by-created', 'createdAt');
        }

        // Sessions store
        if (!db.objectStoreNames.contains(IDB_CONFIG.STORES.SESSIONS)) {
          const sessionStore = db.createObjectStore(IDB_CONFIG.STORES.SESSIONS, {
            keyPath: 'id',
          });
          sessionStore.createIndex('by-user', 'userId');
          sessionStore.createIndex('by-timestamp', 'timestamp');
        }

        // Sync queue store
        if (!db.objectStoreNames.contains(IDB_CONFIG.STORES.SYNC_QUEUE)) {
          const queueStore = db.createObjectStore(IDB_CONFIG.STORES.SYNC_QUEUE, {
            keyPath: 'id',
          });
          queueStore.createIndex('by-type', 'type');
          queueStore.createIndex('by-created', 'createdAt');
        }

        // Metadata store
        if (!db.objectStoreNames.contains(IDB_CONFIG.STORES.METADATA)) {
          db.createObjectStore(IDB_CONFIG.STORES.METADATA);
        }
      },
    });
  }

  /**
   * Ensure database is initialized
   */
  private async ensureDB(): Promise<IDBPDatabase<PictalkDB>> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  // ========== Messages ==========

  async saveMessage(message: Message): Promise<void> {
    const db = await this.ensureDB();
    await db.put(IDB_CONFIG.STORES.MESSAGES, message);
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const db = await this.ensureDB();
    return db.get(IDB_CONFIG.STORES.MESSAGES, id);
  }

  async getMessagesByUser(userId: string, type: 'sent' | 'received'): Promise<Message[]> {
    const db = await this.ensureDB();
    const index = type === 'sent' ? 'by-sender' : 'by-recipient';
    return db.getAllFromIndex(IDB_CONFIG.STORES.MESSAGES, index, userId);
  }

  async getAllMessages(): Promise<Message[]> {
    const db = await this.ensureDB();
    return db.getAll(IDB_CONFIG.STORES.MESSAGES);
  }

  async deleteMessage(id: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete(IDB_CONFIG.STORES.MESSAGES, id);
  }

  // ========== Communication Sessions ==========

  async saveSession(session: CommunicationSession): Promise<void> {
    const db = await this.ensureDB();
    await db.put(IDB_CONFIG.STORES.SESSIONS, session);
  }

  async getSession(id: string): Promise<CommunicationSession | undefined> {
    const db = await this.ensureDB();
    return db.get(IDB_CONFIG.STORES.SESSIONS, id);
  }

  async getSessionsByUser(userId: string): Promise<CommunicationSession[]> {
    const db = await this.ensureDB();
    return db.getAllFromIndex(IDB_CONFIG.STORES.SESSIONS, 'by-user', userId);
  }

  async getAllSessions(): Promise<CommunicationSession[]> {
    const db = await this.ensureDB();
    return db.getAll(IDB_CONFIG.STORES.SESSIONS);
  }

  async deleteSession(id: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete(IDB_CONFIG.STORES.SESSIONS, id);
  }

  // ========== Sync Queue ==========

  async addToSyncQueue(item: QueueItem): Promise<void> {
    const db = await this.ensureDB();
    await db.put(IDB_CONFIG.STORES.SYNC_QUEUE, item);
  }

  async getSyncQueue(): Promise<QueueItem[]> {
    const db = await this.ensureDB();
    return db.getAll(IDB_CONFIG.STORES.SYNC_QUEUE);
  }

  async removeFromSyncQueue(id: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete(IDB_CONFIG.STORES.SYNC_QUEUE, id);
  }

  async clearSyncQueue(): Promise<void> {
    const db = await this.ensureDB();
    const tx = db.transaction(IDB_CONFIG.STORES.SYNC_QUEUE, 'readwrite');
    await tx.objectStore(IDB_CONFIG.STORES.SYNC_QUEUE).clear();
    await tx.done;
  }

  // ========== Metadata ==========

  async setMetadata(key: string, value: MetadataValue): Promise<void> {
    const db = await this.ensureDB();
    await db.put(IDB_CONFIG.STORES.METADATA, value, key);
  }

  async getMetadata<T extends MetadataValue = MetadataValue>(key: string): Promise<T | undefined> {
    const db = await this.ensureDB();
    return db.get(IDB_CONFIG.STORES.METADATA, key) as Promise<T | undefined>;
  }

  async deleteMetadata(key: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete(IDB_CONFIG.STORES.METADATA, key);
  }

  // ========== Favourite Phrases ==========

  async saveFavoritePhrases(
    phrases: Array<{ id: string; icons: unknown[]; sentence: string }>
  ): Promise<void> {
    await this.setMetadata('favorite_phrases', phrases as MetadataValue);
  }

  async getFavoritePhrases(): Promise<Array<{ id: string; icons: unknown[]; sentence: string }>> {
    const data = await this.getMetadata('favorite_phrases');
    return (data as Array<{ id: string; icons: unknown[]; sentence: string }>) ?? [];
  }

  // ========== Local Session (offline-first) ==========

  async saveLocalSession(session: CommunicationSession): Promise<void> {
    await this.saveSession(session);
  }

  async getUnsyncedSessions(): Promise<CommunicationSession[]> {
    const all = await this.getAllSessions();
    return all.filter((s) => !s.synced);
  }

  async markSessionSynced(id: string): Promise<void> {
    const db = await this.ensureDB();
    const session = await db.get(IDB_CONFIG.STORES.SESSIONS, id);
    if (session) {
      await db.put(IDB_CONFIG.STORES.SESSIONS, { ...session, synced: true });
    }
  }

  // ========== Utility ==========

  async clearAll(): Promise<void> {
    const db = await this.ensureDB();
    const stores = [
      IDB_CONFIG.STORES.MESSAGES,
      IDB_CONFIG.STORES.SESSIONS,
      IDB_CONFIG.STORES.SYNC_QUEUE,
      IDB_CONFIG.STORES.METADATA,
    ];

    const tx = db.transaction(stores, 'readwrite');
    await Promise.all(stores.map(store => tx.objectStore(store).clear()));
    await tx.done;
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const indexedDB = new IndexedDBService();
