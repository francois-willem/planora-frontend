// src/app/employee/pending-approval/page.jsx
"use client"
import { useState, useEffect } from 'react';
import { ThemeProvider } from '../../../../lib/ThemeContext';
import Navbar from '../../../../components/Navbar';
import { authConfig } from '../../../../lib/auth';

export default function EmployeePendingApproval() {
  const [user, setUser] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authConfig.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const currentBusiness = authConfig.getCurrentBusiness(currentUser);
      if (currentBusiness) {
        setBusinessName(currentBusiness.businessId.name);
      }
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <Navbar showAuth={true} />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Navbar showAuth={true} />
        
        <main className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <div className="text-center">
                {/* Icon */}
                <div className="text-6xl mb-6">⏳</div>
                
                {/* Title */}
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Account Pending Approval
                </h1>
                
                {/* Description */}
                <div className="space-y-4 text-slate-600 dark:text-slate-300">
                  <p className="text-lg">
                    Your employee account is currently pending approval by the business administrator.
                  </p>
                  
                  <p>
                    <strong>Business:</strong> {businessName || 'Your business'}
                  </p>
                  
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-6">
                    <p className="text-blue-800 dark:text-blue-200">
                      <strong>What happens next?</strong>
                    </p>
                    <ul className="text-blue-700 dark:text-blue-300 text-sm mt-2 space-y-1">
                      <li>• The business administrator will review your application</li>
                      <li>• You'll receive an email notification once approved</li>
                      <li>• You can then access your employee dashboard</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mt-4">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      <strong>Note:</strong> This process typically takes 1-2 business days. 
                      If you haven't heard back within a week, please contact the business administrator directly.
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Check Status Again
                  </button>
                  
                  <button
                    onClick={() => {
                      localStorage.removeItem('authToken');
                      localStorage.removeItem('userData');
                      window.location.href = '/';
                    }}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
                
                {/* Contact Info */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Need help? Contact the business administrator or{' '}
                    <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                      support
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

