// components/AuthButton.js
"use client"
import { useState } from 'react';
import Link from 'next/link';
import { authConfig } from '../lib/auth';

export default function AuthButton({ type = 'login', className = '', children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'login') {
        // Redirect to login page
        window.location.href = '/login';
      } else if (type === 'register') {
        // Redirect to register page
        window.location.href = '/register';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // If it's a link-based button (like in the navbar), use Link
  if (type === 'link') {
    return (
      <Link href={children === 'Get Started' ? '/register' : '/login'} className={className}>
        {children}
      </Link>
    );
  }

  // If it's an action button, use button with auth handler
  return (
    <button
      onClick={handleAuth}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {type === 'login' ? 'Signing In...' : 'Creating Account...'}
        </div>
      ) : (
        children
      )}
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </button>
  );
}

// Specialized components for different auth actions
export function LoginButton({ className = '', children = 'Sign In' }) {
  return (
    <AuthButton type="login" className={className}>
      {children}
    </AuthButton>
  );
}

export function RegisterButton({ className = '', children = 'Get Started' }) {
  return (
    <AuthButton type="register" className={className}>
      {children}
    </AuthButton>
  );
}

export function LogoutButton({ className = '', onLogout }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authConfig.signOut();
      if (onLogout) onLogout();
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Signing Out...
        </div>
      ) : (
        'Sign Out'
      )}
    </button>
  );
}
