/**
 * API request and response types
 */

import { User, Pairing, Message, CommunicationSession, Icon } from './models';

// Auth API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: User['role'];
}

export interface AuthResponse {
  user: User;
  token?: string;
}

// Pairing API
export interface CreatePairingRequestRequest {
  guardianId: string;
}

export interface AcceptPairingRequest {
  token: string;
  childId: string;
  relationship: string;
}

export interface PairingResponse {
  pairing: Pairing;
  qrCode?: string;
}

// Message API
export interface SendMessageRequest {
  recipientId: string;
  content: Message['content'];
}

export interface GetMessagesRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

// Communication Session API
export interface SaveSessionRequest {
  icons: Icon[];
  sentence: string;
}

export interface GetSessionsRequest {
  userId: string;
  startDate?: Date;
  endDate?: Date;
}

export interface SessionsResponse {
  sessions: CommunicationSession[];
  total: number;
}

// Sync API
export interface SyncRequest {
  lastSyncAt?: Date;
  localChanges: {
    messages?: Message[];
    sessions?: CommunicationSession[];
  };
}

export interface SyncResponse {
  serverChanges: {
    messages?: Message[];
    sessions?: CommunicationSession[];
    pairings?: Pairing[];
  };
  conflicts?: SyncConflict[];
  syncedAt: Date;
}

export interface SyncConflict<T = unknown> {
  type: 'message' | 'session' | 'pairing';
  localData: T;
  serverData: T;
  resolution?: 'local' | 'server' | 'merge';
}

export interface ValidationError {
  path: (string | number)[];
  message: string;
  code: string;
}

// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: ValidationError[];
  };
}
