// components/UserProfile.js
// User profile dropdown component that shows user information and navigation options
// This component displays the current user's avatar, name, role, and provides access to their dashboard

"use client" // This directive tells Next.js this component runs on the client side
import { useState, useEffect } from 'react'; // React hooks for state management and side effects
import { authState, authConfig } from '../lib/auth'; // Authentication utilities

export default function UserProfile({ className = '' }) {
  // State variables for managing component data
  const [user, setUser] = useState(null); // Current user data (null if not logged in)
  const [loading, setLoading] = useState(true); // Whether user data is being loaded
  const [showDropdown, setShowDropdown] = useState(false); // Whether dropdown menu is visible

  // useEffect hook runs when component mounts
  useEffect(() => {
    // Subscribe to authentication state changes
    // This ensures the component updates when user logs in/out
    const unsubscribe = authState.subscribe((currentUser, isLoading) => {
      setUser(currentUser); // Update user data
      setLoading(isLoading); // Update loading state
    });

    // Get initial user state from localStorage
    const currentUser = authConfig.getCurrentUser();
    setUser(currentUser);
    setLoading(false); // Authentication check is complete

    // Return unsubscribe function to clean up subscription
    return unsubscribe;
  }, []); // Empty dependency array means this only runs once when component mounts

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div className={`${className} flex items-center`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render anything if user is not logged in
  if (!user) {
    return null; // User not logged in
  }

  // Get user's role and current business context
  const userRole = authConfig.getUserRole(user);
  const currentBusiness = authConfig.getCurrentBusiness(user);
  
  // If no valid role, don't render the component
  if (!userRole) {
    return null;
  }
  
  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Function to get the display name for the user
  // Priority: user's full name > firstName > email
  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${capitalizeFirstLetter(user.firstName)} ${capitalizeFirstLetter(user.lastName)}`;
    }
    if (user.firstName) {
      return capitalizeFirstLetter(user.firstName);
    }
    return user.email; // Fallback to email
  };

  // Function to get the first letter for the avatar
  const getAvatarLetter = () => {
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U'; // Default fallback
  };

  // Color scheme for different user roles
  const roleColors = {
    'super-admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', // Purple for super admin
    admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', // Red for admin
    instructor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', // Blue for instructor
    client: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' // Green for client
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await authConfig.signOut();
      // Close dropdown menu
      setShowDropdown(false);
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`${className} relative`}>
      {/* Profile button that toggles the dropdown menu */}
      <button
        onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
      >
        {/* User avatar with first letter of user's first name */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {getAvatarLetter()} {/* First letter of user's first name */}
          </span>
        </div>
        {/* User information */}
        <div className="text-left">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Welcome back, {user.firstName ? capitalizeFirstLetter(user.firstName) : (user.email?.split('@')[0] ? capitalizeFirstLetter(user.email.split('@')[0]) : 'User')} {/* Welcome message with user's first name */}
          </div>
          {/* Role badge with color coding */}
          <div className={`text-xs px-2 py-1 rounded-full ${roleColors[userRole]}`}>
            {userRole} {/* User's role */}
          </div>
        </div>
        {/* Dropdown arrow that rotates when menu is open */}
        <svg 
          className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu - only shown when showDropdown is true */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
          {/* User information header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {getDisplayName()} {/* User's full name */}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
            {/* Role badge */}
            <div className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${roleColors[userRole]}`}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} {/* Capitalized role */}
            </div>
          </div>
          
          {/* Navigation section */}
          <div className="py-2">
            <a
              href={
                // Route to appropriate dashboard based on user role
                userRole === 'super-admin' ? '/super-admin' :
                userRole === 'admin' ? '/business/dashboard' : 
                userRole === 'client' ? '/client/dashboard' : 
                '/dashboard'
              }
              className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              {/* Dashboard icon */}
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              {/* Dynamic dashboard text based on role */}
              {userRole === 'super-admin' ? 'Super Admin Panel' : 
               userRole === 'admin' ? 'Business Dashboard' : 
               'Dashboard'}
            </a>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              {/* Logout icon */}
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}
