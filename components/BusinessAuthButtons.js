// components/BusinessAuthButtons.js
// Business authentication buttons component
// Provides login and registration buttons specifically for business users

"use client" // This directive tells Next.js this component runs on the client side
import { useState } from 'react'; // React hook for managing component state
import Link from 'next/link'; // Next.js component for client-side navigation

// Main business authentication buttons component
export default function BusinessAuthButtons({ className = '' }) {
  const [loading, setLoading] = useState(false); // Loading state for button interactions

  // Function to handle business authentication actions
  const handleBusinessAuth = async (type) => {
    setLoading(true); // Show loading state
    try {
      if (type === 'login') {
        // Navigate to business login page
        window.location.href = '/business/login';
      } else if (type === 'register') {
        // Navigate to business registration page
        window.location.href = '/business/register';
      }
    } catch (err) {
      // Log any errors that occur during navigation
      console.error('Business auth error:', err);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Business Login Button */}
      <button
        onClick={() => handleBusinessAuth('login')} // Call handleBusinessAuth with 'login' type
        disabled={loading} // Disable button while loading
        className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
      >
        {loading ? 'Loading...' : 'Business Login'} {/* Show loading text or button text */}
      </button>
      {/* Business Registration Button */}
      <button
        onClick={() => handleBusinessAuth('register')} // Call handleBusinessAuth with 'register' type
        disabled={loading} // Disable button while loading
        className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? 'Loading...' : 'Start Your Business'} {/* Show loading text or button text */}
      </button>
    </div>
  );
}

// Specialized components for different business auth actions
// These are individual button components that can be used separately

// Business Login Button - standalone component for login only
export function BusinessLoginButton({ className = '', children = 'Business Login' }) {
  return (
    <button
      onClick={() => window.location.href = '/business/login'} // Navigate to business login page
      className={`text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium ${className}`}
    >
      {children} {/* Use provided children or default text */}
    </button>
  );
}

// Business Register Button - standalone component for registration only
export function BusinessRegisterButton({ className = '', children = 'Start Your Business' }) {
  return (
    <button
      onClick={() => window.location.href = '/business/register'} // Navigate to business registration page
      className={`bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${className}`}
    >
      {children} {/* Use provided children or default text */}
    </button>
  );
}

