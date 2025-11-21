// src/app/business/account-suspended/page.js
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '../../../../lib/ThemeContext';
import ThemeToggle from '../../../../components/ThemeToggle';
import Logo from '../../../../components/Logo';
import { authConfig } from '../../../../lib/auth';

export default function BusinessAccountSuspendedPage() {
  const [user, setUser] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authConfig.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Validate user role
    const userRole = authConfig.getUserRole(currentUser);
    if (userRole !== 'admin') {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    
    // Get business information
    const currentBusiness = authConfig.getCurrentBusiness(currentUser);
    if (currentBusiness) {
      setBusinessInfo(currentBusiness.businessId);
    }
    
    setLoading(false);
  }, [router]);

  const handleSignOut = async () => {
    await authConfig.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
          <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <Logo size="medium" showText={true} />
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={handleSignOut}
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              {/* Status Icon */}
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Account Suspended
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Your business account has been suspended
                </p>
              </div>

              {/* Business Information */}
              {businessInfo && (
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 mb-8">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Business Information
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Business Name:</span>
                      <span className="ml-2 text-slate-900 dark:text-slate-100">{businessInfo.name}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Email:</span>
                      <span className="ml-2 text-slate-900 dark:text-slate-100">{businessInfo.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Business Type:</span>
                      <span className="ml-2 text-slate-900 dark:text-slate-100">{businessInfo.businessType}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Business Code:</span>
                      <span className="ml-2 text-slate-900 dark:text-slate-100 font-mono">{businessInfo.businessCode}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Message */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Account Access Restricted
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>
                        Your business account has been suspended and you cannot access your dashboard at this time. 
                        This may be due to policy violations, payment issues, or other administrative reasons.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  What you can do
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">1</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Contact our support team to understand the reason for the suspension.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">2</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Work with our team to resolve any issues that led to the suspension.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">3</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Once resolved, your account will be reactivated and you can resume normal operations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Contact Support
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  If you believe this suspension is in error or need assistance resolving the issue, please contact our support team immediately.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 text-sm font-medium"
                  >
                    Back to Home
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}