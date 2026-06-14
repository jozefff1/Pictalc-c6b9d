# Quick Setup Guide

## 🎯 To Test Sign Up & Login

### Option 1: Set Up Real Database (Recommended)

1. **Create a Neon Database (Free)**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for a free account
   - Click "Create Project"
   - Copy your connection string (looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`)

2. **Update Environment Variables**
   - Open `.env.local` in the project root
   - Replace the `DATABASE_URL` with your connection string:
   ```bash
   DATABASE_URL="postgresql://your-actual-connection-string"
   ```

3. **Create Database Tables**
   ```bash
   npm run db:push
   ```
   Review the proposed changes before applying them to an existing database.
   The code schema includes staged Phase 9 tenant/RLS definitions that may not
   yet exist in older environments.

4. **Test Registration**
   - Go to [http://localhost:3000/register](http://localhost:3000/register)
   - Fill in the form with:
     - **Name**: At least 2 characters
     - **Email**: Valid email format
     - **Password**: 
       - ✓ At least 8 characters
       - ✓ One uppercase letter (A-Z)
       - ✓ One lowercase letter (a-z)
       - ✓ One number (0-9)
     - **Confirm Password**: Must match
   - Click "Create Account"

5. **Test Login**
   - After registration, you'll be redirected to login
   - Enter your email and password (email matching is case-insensitive)
   - You'll be redirected to the dashboard

### Option 2: Mock Database (For UI Testing Only)

If you just want to test the UI validation without setting up a database:

1. The forms will show you helpful validation messages
2. Password strength indicator shows real-time requirements
3. Field-specific error messages appear when you make mistakes

## 📝 Password Requirements

When signing up, your password **must** include:
- ✓ At least 8 characters
- ✓ At least one uppercase letter (A-Z)
- ✓ At least one lowercase letter (a-z)
- ✓ At least one number (0-9)

**Good examples:**
- `Password123` ✓
- `MyApp2024!` ✓
- `SecurePass99` ✓

**Bad examples:**
- `password` ✗ (no uppercase, no number)
- `PASSWORD` ✗ (no lowercase, no number)
- `Pass123` ✗ (too short)

## 🔍 Troubleshooting

### "Invalid input" error
- Check if password meets all 4 requirements (length, uppercase, lowercase, number)
- Ensure passwords match in both fields
- Name must be at least 2 characters
- Email must be valid format (e.g., user@example.com)

### "User with this email already exists"
- Try a different email address
- Or log in instead using the existing account

### "Database connection error"
- Make sure you've set up the Neon database
- Verify `DATABASE_URL` in `.env.local` is correct
- Run `npm run db:push` to create tables after reviewing the proposed schema changes

### Login fails after changing the Drizzle schema
- Confirm the database migration was applied before relying on newly declared columns
- `users.tenant_id` and `tenants` are currently staged Phase 9 definitions and may be absent in older databases
- Auth queries must use explicit compatible column lists until every environment has the tenant migration

## 🎨 Features to Try

After logging in:
- ✓ AAC icon board — 101 pictograms across 6 categories
- ✓ Sentence builder with text-to-speech (speed + pitch configurable)
- ✓ Text → icons and Speech → icons conversion
- ✓ Custom icon upload (your own photos as AAC symbols)
- ✓ Favourite phrases — save and reload icon sentences
- ✓ Recently used icons row and icon search
- ✓ Language learning mode — 5 languages, 3 modes (flashcard / writing / speaking)
- ✓ Communication session history with supervisor patient selector
- ✓ Supervisor pairing — invite participants via link or email (`/dashboard/patients`)
- ✓ Voice + accessibility preferences (`/dashboard/settings`)
- ✓ Dark mode and language switcher (EN / NO / ES / FR / DE)
- ✓ PWA — installable from browser with selected offline persistence

Complete offline synchronization, conflict handling, and offline upload queues
are planned and should not be treated as production-ready.
