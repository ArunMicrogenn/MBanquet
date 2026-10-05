// Safe storage wrapper that provides in-memory fallback if localStorage is unavailable
// (e.g. inside cross-origin sandboxed iframes or private browsing modes)

class MemoryStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const memoryStorage = new MemoryStorage();

function checkStorageAvailability(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__storage_test_key__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const isAvailable = checkStorageAvailability();

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (isAvailable) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage.getItem(key);
    } catch {
      return memoryStorage.getItem(key);
    }
  },

  setItem(key: string, value: string): void {
    try {
      if (isAvailable) {
        window.localStorage.setItem(key, value);
      } else {
        memoryStorage.setItem(key, value);
      }
    } catch {
      memoryStorage.setItem(key, value);
    }
  },

  removeItem(key: string): void {
    try {
      if (isAvailable) {
        window.localStorage.removeItem(key);
      } else {
        memoryStorage.removeItem(key);
      }
    } catch {
      memoryStorage.removeItem(key);
    }
  },

  clear(): void {
    try {
      if (isAvailable) {
        window.localStorage.clear();
      } else {
        memoryStorage.clear();
      }
    } catch {
      memoryStorage.clear();
    }
  }
};
