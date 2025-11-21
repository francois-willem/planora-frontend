// src/app/business/pending-approval/page.js
"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '../../../../lib/ThemeContext';
import ThemeToggle from '../../../../components/ThemeToggle';
import Logo from '../../../../components/Logo';
import { authConfig } from '../../../../lib/auth';

export default function BusinessPendingApprovalPage() {
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
                <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Account Pending Approval
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Your business account is currently under review
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
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Account Under Review
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>
                        Your business account has been submitted and is currently being reviewed by our team. 
                        This process typically takes 1-2 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  What happens next?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">1</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Our team will review your business information and verify your account details.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">2</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        You&apos;ll receive an email notification once your account is approved.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">3</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        You&apos;ll be able to access your business dashboard and start managing your classes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  If you have any questions about your account status or need assistance, please don&apos;t hesitate to contact us.
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
