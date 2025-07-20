# Deployment Guide

## Environment Variables Required

Before deployment, ensure these environment variables are set:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## For Local Development

1. Create a `.env.local` file in the project root
2. Add the environment variables above
3. Run `npm run dev`

## For Production Deployment

### Option 1: Vercel (Recommended - Free)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via GitHub**:
   - Push your code to GitHub
   - Connect GitHub repo to Vercel at [vercel.com](https://vercel.com)
   - Vercel auto-detects Vite configuration

3. **Set Environment Variables in Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL = https://sofdamvpfurfhnmphpis.supabase.co
     VITE_SUPABASE_ANON_KEY = your_anon_key_from_env_local
     ```

4. **Deploy**: Vercel automatically builds and deploys on every push

### Option 2: Other Platforms

1. Set environment variables in your hosting platform
2. Run `npm run build` to create production build
3. Deploy the `dist` folder

## Security Notes

- ✅ API keys moved to environment variables
- ✅ .gitignore configured to exclude environment files
- ✅ Build process tested and working
- ✅ No hardcoded sensitive information in source code

## Database Migrations

Ensure all database migrations are applied in your Supabase project:
- reviews.title column added
- bookings.payment_status column added  
- profiles.phone column added
- RLS policies updated for authenticated users
- Storage bucket configured for public access

## Features Verified

- ✅ Car browsing and filtering
- ✅ User authentication (login/signup/forgot password)
- ✅ Booking system (payment-free flow)
- ✅ Car management (add/view/delete for admins)
- ✅ Profile management
- ✅ Admin dashboard
- ✅ Review system
- ✅ Image upload and display