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
   npx drizzle-kit push
   ```

4. **Test Registration**
   - Go to [http://localhost:3001/register](http://localhost:3001/register)
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
   - Enter your email and password
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
- Run `npx drizzle-kit push` to create tables

## 🎨 Features to Try

After logging in:
- ✓ Landing page with features showcase
- ✓ Registration with role selection (Child/Guardian/Teacher/Therapist)
- ✓ Login with success message
- ✓ Protected dashboard (requires authentication)
- ✓ Dark mode support
- ✓ Responsive design

## 🚀 Next Steps

Communication interface coming soon with:
- Icon-based sentence building
- Text-to-speech
- Device pairing with QR codes
- Offline mode with sync
