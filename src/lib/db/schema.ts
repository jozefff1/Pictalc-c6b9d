import { pgTable, pgPolicy, text, timestamp, varchar, uuid, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

/**
 * Tenants table — institutional isolation unit (school, clinic, research group).
 * Every RLS-protected table will reference this via tenant_id.
 * NOTE: apply pgPolicy to individual tables during Phase 9 migration sprints
 * only after all API routes are wrapped with withTenantContext().
 */
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: varchar('type', { length: 50 }).notNull().default('school'), // school, clinic, hospital, university, research_center
  country: varchar('country', { length: 2 }),
  tier: varchar('tier', { length: 20 }).notNull().default('free'), // free, professional, institutional, research
  adminUserId: uuid('admin_user_id'), // set after first admin user is created
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},
(table) => [
  pgPolicy('tenant_self_isolation', {
    for: 'all',
    to: 'authenticated',
    using: sql`id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid`,
  }),
]);

/**
 * Users table - stores all user accounts
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  // tenantId: nullable — individual (family) users have no tenant; institutional users are linked
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'set null' }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).notNull(), // child, guardian, therapist, teacher
  avatar: text('avatar'),
  emailVerified: boolean('email_verified').default(false),
  verificationToken: text('verification_token'),
  verificationTokenExpiry: timestamp('verification_token_expiry'),
  resetToken: text('reset_token'),
  resetTokenExpiry: timestamp('reset_token_expiry'),
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
  relationship: varchar('relationship', { length: 100 }).notNull(), // parent, teacher, therapist, researcher, caregiver
  // Consent — all off by default; patient explicitly opts in on invite acceptance
  shareHistory: boolean('share_history').default(false).notNull(),
  shareStats: boolean('share_stats').default(false).notNull(),
  allowExport: boolean('allow_export').default(false).notNull(),
  consentAt: timestamp('consent_at'),
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
  // If set, only the user with this email may accept the invite
  invitedEmail: varchar('invited_email', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull(), // pending, used, expired, declined
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
  // Privacy: 'private' sessions are never visible to supervisors
  visibility: varchar('visibility', { length: 20 }).default('private').notNull(), // 'private' | 'shared'
  // Research task type — extensible for future structured tasks
  taskType: varchar('task_type', { length: 50 }).default('free').notNull(), // 'free' | 'structured' | 'assessment'
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
export const tenantsRelations = relations(tenants, ({ many }) => ({
  members: many(users),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  tenant: one(tenants, { fields: [users.tenantId], references: [tenants.id] }),
  devices: many(devices),
  guardianPairings: many(pairings, { relationName: 'guardian' }),
  childPairings: many(pairings, { relationName: 'child' }),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'recipient' }),
  sessions: many(communicationSessions),
  preferences: one(userPreferences),
  customIcons: many(customIcons),
  userSentences: many(userSentences),
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

/**
 * Password History table - stores previous password hashes to prevent reuse
 */
export const passwordHistory = pgTable('password_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const passwordHistoryRelations = relations(passwordHistory, ({ one }) => ({
  user: one(users, {
    fields: [passwordHistory.userId],
    references: [users.id],
  }),
}));

/**
 * User Sentences table - user-created custom phrases for communication
 */
export const userSentences = pgTable('user_sentences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  text: text('text').notNull(),
  iconIds: jsonb('icon_ids').notNull().$type<string[]>(),
  category: varchar('category', { length: 50 }).notNull().default('custom'),
  language: varchar('language', { length: 10 }).notNull().default('en'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userSentencesRelations = relations(userSentences, ({ one }) => ({
  user: one(users, {
    fields: [userSentences.userId],
    references: [users.id],
  }),
}));
