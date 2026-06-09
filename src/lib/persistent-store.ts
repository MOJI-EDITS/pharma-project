import fs from 'fs';
import path from 'path';

// Create a persistent store using the file system for development
// This file-based store will survive server restarts

const getStoreDir = () => {
  try {
    // Use /tmp for development store (works cross-platform)
    const tmpDir = process.env.TEMP || process.env.TMP || '/tmp';
    return path.join(tmpDir, 'pharma-dev-store');
  } catch {
    // Fallback to current working directory
    return path.join(process.cwd(), '.dev-store');
  }
};

const STORE_DIR = getStoreDir();
const USERS_FILE = path.join(STORE_DIR, 'users.json');

// Ensure store directory exists
try {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create store directory:', err);
}

// Initialize store
let cachedUsers: Map<string, any> = new Map();
let isLoaded = false;

function loadUsersFromDisk() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(data);
      cachedUsers.clear();
      for (const [key, value] of users) {
        cachedUsers.set(key, value);
      }
      console.log(`Loaded ${cachedUsers.size} users from disk`);
      isLoaded = true;
      return;
    }
  } catch (err) {
    console.error('Failed to load users from disk:', err);
  }
  isLoaded = true;
}

function saveUsersToDisk() {
  try {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }
    const data = Array.from(cachedUsers.entries());
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Saved ${cachedUsers.size} users to disk`);
  } catch (err) {
    console.error('Failed to save users to disk:', err);
  }
}

// Load users on first access
if (!isLoaded) {
  loadUsersFromDisk();
}

export const persistentUserStore = {
  get(key: string) {
    if (!isLoaded) loadUsersFromDisk();
    return cachedUsers.get(key);
  },

  set(key: string, value: any) {
    if (!isLoaded) loadUsersFromDisk();
    cachedUsers.set(key, value);
    saveUsersToDisk();
  },

  has(key: string) {
    if (!isLoaded) loadUsersFromDisk();
    return cachedUsers.has(key);
  },

  delete(key: string) {
    if (!isLoaded) loadUsersFromDisk();
    const result = cachedUsers.delete(key);
    saveUsersToDisk();
    return result;
  },

  clear() {
    cachedUsers.clear();
    saveUsersToDisk();
  },

  entries() {
    if (!isLoaded) loadUsersFromDisk();
    return cachedUsers.entries();
  },

  values() {
    if (!isLoaded) loadUsersFromDisk();
    return cachedUsers.values();
  },

  keys() {
    if (!isLoaded) loadUsersFromDisk();
    return cachedUsers.keys();
  },

  size() {
    if (!isLoaded) loadUsersFromDisk();
    return cachedUsers.size;
  },

  getAll() {
    if (!isLoaded) loadUsersFromDisk();
    return Array.from(cachedUsers.values());
  },

  reload() {
    isLoaded = false;
    loadUsersFromDisk();
  },
};

