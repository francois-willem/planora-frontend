# Vercel Deployment Guide

This guide explains how to deploy the Planora frontend to Vercel and configure the environment variables.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your backend API deployed (e.g., on Railway, Render, or another hosting service)
- The backend API URL (e.g., `https://your-backend.railway.app`)

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Select the repository containing the `planora-frontend` folder

### 2. Configure Project Settings

1. **Root Directory**: Set the root directory to `planora-frontend`
   - In the project settings, go to "Settings" → "General"
   - Under "Root Directory", click "Edit"
   - Enter `planora-frontend` and save

2. **Framework Preset**: Vercel should automatically detect Next.js
   - If not, select "Next.js" as the framework preset

3. **Build Command**: Should be `npm run build` (default for Next.js)
4. **Output Directory**: Should be `.next` (default for Next.js)

### 3. Set Environment Variables

**IMPORTANT**: You must set the environment variable before deploying.

1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Click "Add New"
3. Add the following environment variable:

   **Name**: `NEXT_PUBLIC_API_URL`
   
   **Value**: Your backend API URL (e.g., `https://your-backend.railway.app`)
   
   **Environment**: Select all environments (Production, Preview, Development)

   **Example**:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://planora-backend-production.up.railway.app
   ```

   ⚠️ **Important Notes**:
   - Do NOT include a trailing slash in the URL
   - Use `https://` (not `http://`) for production
   - The URL should be the base URL of your backend (without `/api`)

### 4. Deploy

1. Click "Deploy" in the Vercel dashboard
2. Vercel will build and deploy your application
3. Once deployment is complete, you'll receive a URL (e.g., `https://your-app.vercel.app`)

### 5. Verify Deployment

1. Visit your deployed frontend URL
2. Test that API calls are working by:
   - Attempting to log in
   - Checking browser console for any API errors
   - Verifying that requests are going to your backend URL (check Network tab in browser DevTools)

## Environment Variable Details

### NEXT_PUBLIC_API_URL

- **Purpose**: Base URL for all backend API calls
- **Format**: Full URL without trailing slash (e.g., `https://api.example.com`)
- **Why NEXT_PUBLIC_**: The `NEXT_PUBLIC_` prefix makes this variable available in the browser
- **Default**: If not set, defaults to `http://localhost:4000` for local development

### How It's Used

The frontend uses this environment variable in `lib/config.js`:

```javascript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
```

All API calls throughout the application use the `buildApiUrl()` helper function which constructs URLs using this base URL.

## Troubleshooting

### API Calls Failing

1. **Check Environment Variable**:
   - Go to Vercel dashboard → Settings → Environment Variables
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Ensure it's set for the correct environment (Production/Preview)

2. **Verify Backend URL**:
   - Make sure your backend is accessible at the URL you specified
   - Test the backend URL directly in a browser or with curl
   - Check for CORS issues if requests are blocked

3. **Redeploy After Changes**:
   - If you change environment variables, you must redeploy
   - Go to Deployments → Click the three dots on latest deployment → Redeploy

### CORS Errors

If you see CORS errors in the browser console:

1. Ensure your backend allows requests from your Vercel domain
2. Add your Vercel URL to the backend's CORS allowed origins
3. Example backend CORS configuration:
   ```javascript
   cors({
     origin: [
       'https://your-app.vercel.app',
       'https://your-app-git-main.vercel.app', // Preview deployments
     ]
   })
   ```

### Build Errors

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility (Vercel uses Node 18.x by default)

## Redeploying After Environment Variable Changes

**IMPORTANT**: After adding or modifying environment variables in Vercel:

1. Go to your project dashboard
2. Navigate to "Deployments"
3. Find your latest deployment
4. Click the three dots (⋯) → "Redeploy"
5. This ensures the new environment variables are used

Alternatively, you can trigger a new deployment by:
- Pushing a new commit to your repository
- Vercel will automatically redeploy with the updated environment variables

## Local Development

For local development, create a `.env.local` file in the `planora-frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

This file should be in `.gitignore` and not committed to version control.

## Production Checklist

- [ ] Environment variable `NEXT_PUBLIC_API_URL` is set in Vercel
- [ ] Backend API is deployed and accessible
- [ ] CORS is configured on backend to allow Vercel domain
- [ ] Test login functionality
- [ ] Test API calls in browser DevTools Network tab
- [ ] Verify no hardcoded URLs remain in the codebase
- [ ] Check that all API endpoints are working correctly

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify backend API is running and accessible
4. Ensure environment variables are set correctly

