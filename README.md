# Planora Frontend

A modern Next.js application for managing multi-business scheduling, client management, and class bookings. Built with React 19, Next.js 15, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API server running (see [Backend README](../planora-backend/README.md))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env.local` file in the root of the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
planora-frontend/
├── src/
│   └── app/                    # Next.js App Router pages
│       ├── admin/              # Admin panel pages
│       ├── business/           # Business admin pages
│       ├── client/             # Client-facing pages
│       ├── employee/           # Employee/instructor pages
│       ├── super-admin/        # Super admin pages
│       ├── pricing/            # Pricing page
│       ├── layout.js           # Root layout
│       └── page.js             # Home page
├── components/                 # Reusable React components
│   ├── admin/                 # Admin-specific components
│   ├── BusinessAuthButtons.js
│   ├── ClientAuthButtons.js
│   ├── MemberManagement.js
│   ├── ScheduleManagement.js
│   └── ...
├── lib/                        # Utility functions and configs
│   ├── auth.js                # Authentication utilities
│   ├── config.js               # API configuration
│   ├── tierConstants.js        # Subscription tier definitions
│   ├── ThemeContext.js         # Theme management
│   └── TierContext.js          # Tier context provider
├── public/                     # Static assets
│   ├── planora-logo.png
│   └── ...
├── package.json
├── next.config.mjs             # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md                   # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Tech Stack

- **Framework**: Next.js 15.5.3 (App Router)
- **React**: 19.1.0
- **Styling**: Tailwind CSS 4
- **Authentication**: JWT-based with localStorage
- **State Management**: React Context API
- **Build Tool**: Turbopack

## 🔐 Authentication Flow

The frontend uses JWT tokens stored in localStorage for authentication. Key authentication utilities are in `lib/auth.js`:

- `login()` - Authenticate user and store token
- `logout()` - Clear authentication data
- `getAuthToken()` - Retrieve stored token
- `isAuthenticated()` - Check authentication status
- `getUserRole()` - Get current user role

## 📱 Key Features

### Multi-Business Support
- Business selector component for switching contexts
- Role-based access control per business
- Isolated data views per business

### User Roles
- **Super Admin**: Platform-wide management
- **Business Admin**: Business-specific management
- **Client**: Personal schedule and bookings
- **Employee/Instructor**: Class management and notes

### Subscription Tiers
- 4-tier system (Basic, Starter, Growth, Unlimited)
- Feature-based access control via `FeatureWrapper` component
- Tier information managed through `TierContext`

### Member Management
- Parent-child account relationships
- Multiple member profiles per account
- Member-specific scheduling and notes

## 🔌 API Integration

All API calls are configured through `lib/config.js`:

- Base URL: `NEXT_PUBLIC_API_URL` environment variable
- Endpoint builder: `buildApiUrl()` helper function
- Predefined endpoints: `API_ENDPOINTS` object

### Example API Call

```javascript
import { buildApiUrl, API_ENDPOINTS } from '@/lib/config';

const response = await fetch(buildApiUrl(API_ENDPOINTS.LOGIN), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});
```

## 🎯 Key Components

### Authentication Components
- `AuthButton.js` - Universal authentication button
- `BusinessAuthButtons.js` - Business-specific auth buttons
- `ClientAuthButtons.js` - Client-specific auth buttons

### Management Components
- `BusinessSelector.js` - Switch between businesses
- `MemberManagement.js` - Manage family members
- `ScheduleManagement.js` - Class scheduling interface
- `SessionManagement.js` - Session booking and management
- `ClassManagement.js` - Class creation and editing
- `EmployeeManagement.js` - Staff management

### Feature Components
- `FeatureWrapper.js` - Conditional feature rendering based on tier
- `TierSelector.js` - Subscription tier selection
- `UserProfile.js` - User profile management
- `PasswordChangeModal.js` - Password update modal

## 🌐 Routing

The application uses Next.js App Router with the following main routes:

- `/` - Home page
- `/pricing` - Subscription pricing information
- `/login` - Universal login page
- `/client/login` - Client login
- `/client/register` - Client registration
- `/client/dashboard` - Client dashboard
- `/business/login` - Business admin login
- `/business/register` - Business registration
- `/business/dashboard` - Business admin dashboard
- `/admin/login` - Admin login
- `/admin` - Admin panel
- `/super-admin/login` - Super admin login
- `/super-admin` - Super admin panel

## 🎨 Styling

The project uses Tailwind CSS 4 for styling with:
- Custom theme configuration
- Dark mode support via `ThemeContext`
- Responsive design utilities
- Component-based styling approach

## 🔧 Environment Variables

Required environment variables:

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: `http://localhost:4000`)

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## 🐛 Troubleshooting

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend server is running
- Verify CORS settings on backend

### Authentication Issues
- Clear localStorage and try logging in again
- Check token expiration
- Verify backend authentication endpoints

### Build Issues
- Clear `.next` folder and rebuild
- Check Node.js version compatibility
- Verify all dependencies are installed

## 📝 Development Notes

- Uses Turbopack for faster development builds
- App Router is used instead of Pages Router
- Server components are used where appropriate
- Client components marked with `"use client"` directive

## 🤝 Contributing

When contributing to the frontend:

1. Follow existing code style and patterns
2. Use TypeScript-style JSDoc comments where helpful
3. Ensure components are responsive
4. Test across different user roles
5. Verify feature restrictions work with tier system

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Backend README](../planora-backend/README.md) - Backend API documentation


