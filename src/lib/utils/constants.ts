/**
 * Application constants
 */

export const APP_NAME = 'Snakke';
export const APP_DESCRIPTION = 'Augmentative and Alternative Communication (AAC) app for accessible communication';

// API Routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  PAIRING: {
    CREATE: '/api/pairing/create',
    ACCEPT: '/api/pairing/accept',
    LIST: '/api/pairing/list',
    DELETE: '/api/pairing/:id',
  },
  MESSAGES: {
    LIST: '/api/messages',
    SEND: '/api/messages/send',
    MARK_READ: '/api/messages/:id/read',
  },
  SESSIONS: {
    LIST: '/api/sessions',
    CREATE: '/api/sessions/create',
  },
  SYNC: '/api/sync',
} as const;

// App Routes
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COMMUNICATE: '/communicate',
  PROFILE: '/profile',
  PAIRING: {
    SCAN: '/pairing/scan',
    REQUEST: '/pairing/request',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'snakke_theme',
  USER_PREFERENCES: 'snakke_preferences',
  OFFLINE_QUEUE: 'snakke_offline_queue',
  LAST_SYNC: 'snakke_last_sync',
} as const;

// IndexedDB Configuration
export const IDB_CONFIG = {
  NAME: 'snakke_db',
  VERSION: 1,
  STORES: {
    MESSAGES: 'messages',
    SESSIONS: 'sessions',
    SYNC_QUEUE: 'sync_queue',
    METADATA: 'metadata',
  },
} as const;

// Sync Configuration
export const SYNC_CONFIG = {
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // ms
  BATCH_SIZE: 50,
  AUTO_SYNC_INTERVAL: 30000, // 30 seconds
} as const;

// Pairing Configuration
export const PAIRING_CONFIG = {
  TOKEN_EXPIRY: 300000, // 5 minutes in ms
  QR_CODE_SIZE: 256,
} as const;

// Speech Synthesis Configuration
export const SPEECH_CONFIG = {
  DEFAULT_RATE: 1.0,
  DEFAULT_PITCH: 1.0,
  DEFAULT_VOLUME: 1.0,
  LANG: 'en-US',
} as const;
