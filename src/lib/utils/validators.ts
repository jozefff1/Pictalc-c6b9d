import { z } from 'zod';

/**
 * User registration schema
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['child', 'guardian', 'therapist', 'teacher']),
});

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Pairing request schema
 */
export const pairingRequestSchema = z.object({
  guardianId: z.string().uuid('Invalid guardian ID'),
});

/**
 * Accept pairing schema
 */
export const acceptPairingSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  childId: z.string().uuid('Invalid child ID'),
  relationship: z.string().min(1, 'Relationship is required'),
});

/**
 * Icon schema for validation
 */
export const iconSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['needs', 'actions', 'feelings', 'people', 'places', 'custom']),
  imageUrl: z.string().optional(),
  symbol: z.string().optional(),
  color: z.string().optional(),
});

/**
 * Send message schema
 */
export const sendMessageSchema = z.object({
  recipientId: z.string().uuid('Invalid recipient ID'),
  content: z.object({
    type: z.enum(['text', 'icons']),
    text: z.string().optional(),
    icons: z.array(iconSchema).optional(),
  }),
});

/**
 * Create session schema
 */
export const createSessionSchema = z.object({
  icons: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    imageUrl: z.string().optional(),
    symbol: z.string().optional(),
    color: z.string().optional(),
  })),
  sentence: z.string().min(1, 'Sentence cannot be empty'),
});

/**
 * Update preferences schema
 */
export const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  language: z.string().optional(),
  voiceSpeed: z.number().min(0.5).max(2.0).optional(),
  voicePitch: z.number().min(0.5).max(2.0).optional(),
  hapticEnabled: z.boolean().optional(),
  highContrast: z.boolean().optional(),
  textSize: z.number().min(1.0).max(3.0).optional(),
  reduceMotion: z.boolean().optional(),
});
