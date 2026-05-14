import { pgTable, text, timestamp, varchar, uuid, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Users table - stores all user accounts
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).notNull(), // child, guardian, therapist, teacher
  avatar: text('avatar'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Devices table - tracks user devices for pairing and sync
 */
export const devices = pgTable('devices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  deviceToken: varchar('device_token', { length: 255 }).notNull().unique(),
  platform: varchar('platform', { length: 50 }).notNull(), // web, ios, android
  lastActive: timestamp('last_active').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Pairings table - relationships between guardians and children
 */
export const pairings = pgTable('pairings', {
  id: uuid('id').primaryKey().defaultRandom(),
  guardianId: uuid('guardian_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  childId: uuid('child_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // pending, accepted, rejected, expired
  relationship: varchar('relationship', { length: 100 }).notNull(), // parent, teacher, therapist, caregiver
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
});

/**
 * Pairing Requests table - temporary tokens for QR code pairing
 */
export const pairingRequests = pgTable('pairing_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  requesterId: uuid('requester_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull(), // pending, used, expired
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Messages table - communication between paired users
 */
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  recipientId: uuid('recipient_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: jsonb('content').notNull(), // { type: 'text' | 'icons', text?: string, icons?: Icon[] }
  status: varchar('status', { length: 50 }).notNull(), // draft, sent, delivered, read
  createdAt: timestamp('created_at').defaultNow().notNull(),
  syncedAt: timestamp('synced_at'),
});

/**
 * Communication Sessions table - logs of icon-based communication
 */
export const communicationSessions = pgTable('communication_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  icons: jsonb('icons').notNull(), // Icon[]
  sentence: text('sentence').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  synced: boolean('synced').default(false),
});

/**
 * User Preferences table - user settings and preferences
 */
export const userPreferences = pgTable('user_preferences', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  theme: varchar('theme', { length: 50 }).default('auto'), // light, dark, auto
  language: varchar('language', { length: 10 }).default('en'),
  voiceSpeed: decimal('voice_speed', { precision: 3, scale: 2 }).default('1.00'),
  voicePitch: decimal('voice_pitch', { precision: 3, scale: 2 }).default('1.00'),
  hapticEnabled: boolean('haptic_enabled').default(true),
  highContrast: boolean('high_contrast').default(false),
  textSize: decimal('text_size', { precision: 3, scale: 2 }).default('1.00'),
  reduceMotion: boolean('reduce_motion').default(false),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Custom Icons table - user-uploaded custom communication icons
 */
export const customIcons = pgTable('custom_icons', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  imageUrl: text('image_url').notNull(),
  color: varchar('color', { length: 7 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  devices: many(devices),
  guardianPairings: many(pairings, { relationName: 'guardian' }),
  childPairings: many(pairings, { relationName: 'child' }),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'recipient' }),
  sessions: many(communicationSessions),
  preferences: one(userPreferences),
  customIcons: many(customIcons),
}));

export const devicesRelations = relations(devices, ({ one }) => ({
  user: one(users, {
    fields: [devices.userId],
    references: [users.id],
  }),
}));

export const pairingsRelations = relations(pairings, ({ one }) => ({
  guardian: one(users, {
    fields: [pairings.guardianId],
    references: [users.id],
    relationName: 'guardian',
  }),
  child: one(users, {
    fields: [pairings.childId],
    references: [users.id],
    relationName: 'child',
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: 'recipient',
  }),
}));

export const communicationSessionsRelations = relations(communicationSessions, ({ one }) => ({
  user: one(users, {
    fields: [communicationSessions.userId],
    references: [users.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const customIconsRelations = relations(customIcons, ({ one }) => ({
  user: one(users, {
    fields: [customIcons.userId],
    references: [users.id],
  }),
}));
