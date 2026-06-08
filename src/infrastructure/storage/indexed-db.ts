import { openDB, IDBPDatabase } from 'idb';
import { Task, Log, Template, AppSettings, JiraConfig, TimeClock } from '@/core/domain/entities';

const DB_NAME = 'sprintolog-db';
const DB_VERSION = 1;

export interface SprintoLogDB {
  tasks: Task;
  logs: Log;
  templates: Template;
  settings: AppSettings & { id: string };
  jiraConfig: JiraConfig & { id: string };
  timeClock: TimeClock & { id: string };
}

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

export const getDB = () => {
  if (typeof window === 'undefined') return null;
  
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('logs')) {
          db.createObjectStore('logs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('jiraConfig')) {
          db.createObjectStore('jiraConfig', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('timeClock')) {
          db.createObjectStore('timeClock', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const storage = {
  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await getDB();
    if (!db) return [];
    return db.getAll(storeName);
  },
  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    const db = await getDB();
    if (!db) return undefined;
    return db.get(storeName, id);
  },
  async put<T>(storeName: string, data: T) {
    const db = await getDB();
    if (!db) return;
    return db.put(storeName, data);
  },
  async delete(storeName: string, id: string) {
    const db = await getDB();
    if (!db) return;
    return db.delete(storeName, id);
  },
  async clear(storeName: string) {
    const db = await getDB();
    if (!db) return;
    return db.clear(storeName);
  }
};
