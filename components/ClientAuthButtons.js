// components/ClientAuthButtons.js
"use client"
import { useState } from 'react';

export default function ClientAuthButtons({ businessSlug = 'client', className = '' }) {
  const [loading, setLoading] = useState(false);

  const handleClientAuth = async (type) => {
    setLoading(true);
    try {
      if (type === 'login') {
        window.location.href = '/client/login';
      } else if (type === 'register') {
        window.location.href = '/client/register';
      }
    } catch (err) {
      console.error('Client auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <button
        onClick={() => handleClientAuth('login')}
        disabled={loading}
        className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
      >
        {loading ? 'Loading...' : 'Client Login'}
      </button>
      <button
        onClick={() => handleClientAuth('register')}
        disabled={loading}
        className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? 'Loading...' : 'Join as Client'}
      </button>
    </div>
  );
}

// Specialized components for different client auth actions
export function ClientLoginButton({ businessSlug = 'client', className = '', children = 'Client Login' }) {
  return (
    <button
      onClick={() => window.location.href = '/client/login'}
      className={`text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium ${className}`}
    >
      {children}
    </button>
  );
}

export function ClientRegisterButton({ businessSlug = 'client', className = '', children = 'Join as Client' }) {
  return (
    <button
      onClick={() => window.location.href = '/client/register'}
      className={`bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </button>
  );
}

