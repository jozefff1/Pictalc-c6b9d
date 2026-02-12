/**
 * Application constants
 */

export const APP_NAME = 'Pictalk';
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

// Icon Categories
export const ICON_CATEGORIES = {
  NEEDS: { id: 'needs', name: 'Needs', color: '#FF9D4D' },
  ACTIONS: { id: 'actions', name: 'Actions', color: '#5AC8FA' },
  FEELINGS: { id: 'feelings', name: 'Feelings', color: '#FF6B8B' },
  PEOPLE: { id: 'people', name: 'People', color: '#BF5AF2' },
  PLACES: { id: 'places', name: 'Places', color: '#4CD964' },
  CUSTOM: { id: 'custom', name: 'Custom', color: '#8E8E93' },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'pictalk_theme',
  USER_PREFERENCES: 'pictalk_preferences',
  OFFLINE_QUEUE: 'pictalk_offline_queue',
  LAST_SYNC: 'pictalk_last_sync',
} as const;

// IndexedDB Configuration
export const IDB_CONFIG = {
  NAME: 'pictalk_db',
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
