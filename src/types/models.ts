/**
 * Core data models for Pictalk AAC application
 */

export type UserRole = 'child' | 'guardian' | 'therapist' | 'teacher';
export type DevicePlatform = 'web' | 'ios' | 'android';
export type PairingStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
export type MessageStatus = 'draft' | 'sent' | 'delivered' | 'read';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Device {
  id: string;
  userId: string;
  deviceToken: string;
  platform: DevicePlatform;
  lastActive: Date;
  createdAt: Date;
}

export interface Pairing {
  id: string;
  guardianId: string;
  childId: string;
  status: PairingStatus;
  relationship: string; // 'parent', 'teacher', 'therapist', 'researcher', 'caregiver'
  shareHistory: boolean;
  shareStats: boolean;
  allowExport: boolean;
  consentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: MessageContent;
  status: MessageStatus;
  createdAt: Date;
  syncedAt?: Date;
}

export interface MessageContent {
  type: 'text' | 'icons';
  text?: string;
  icons?: Icon[];
}

export interface Icon {
  id: string;
  name: string;
  category: IconCategory;
  imageUrl?: string;
  symbol?: string; // Material icon name or emoji
  color?: string;
}

export type IconCategory = 'needs' | 'actions' | 'feelings' | 'people' | 'places' | 'custom';

export interface CommunicationSession {
  id: string;
  userId: string;
  icons: Icon[];
  sentence: string;
  timestamp: Date;
  synced: boolean;
  visibility?: 'private' | 'shared';
  taskType?: 'free' | 'structured' | 'assessment';
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  voiceSpeed: number; // 0.5 to 2.0
  voicePitch: number; // 0.5 to 2.0
  hapticEnabled: boolean;
  highContrast: boolean;
  textSize: number; // 1.0 to 3.0
  reduceMotion: boolean;
}

export interface PairingRequest {
  id: string;
  requesterId: string;
  targetUserId?: string;
  token: string;
  status: PairingStatus;
  expiresAt: Date;
  createdAt: Date;
}
