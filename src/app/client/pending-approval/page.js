"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '../../../../lib/ThemeContext';
import ThemeToggle from '../../../../components/ThemeToggle';
import Logo from '../../../../components/Logo';
import { buildApiUrl, API_ENDPOINTS } from '../../../../lib/config';
import { authConfig } from '../../../../lib/auth';

export default function ClientPendingApprovalPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkStatusLoading, setCheckStatusLoading] = useState(false);

  useEffect(() => {
    const loadPageData = async () => {
      const currentUser = authConfig.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const currentBusiness = authConfig.getCurrentBusiness(currentUser);
        if (currentBusiness && currentBusiness.businessId) {
          setBusinessInfo({
            name: currentBusiness.businessId.name,
            email: currentBusiness.businessId.email,
            businessType: currentBusiness.businessId.businessType,
            businessCode: currentBusiness.businessId.businessCode,
            status: currentBusiness.businessId.status
          });

          // If business is not active, redirect to business pending page
          if (currentBusiness.businessId.status !== 'active') {
            router.push('/client/pending-business-activation');
            return;
          }
        } else {
          setError('No business information found. Please contact support.');
        }
      } else {
        setError('You are not logged in. Please log in to view this page.');
        router.push('/client/login');
        return;
      }
      setLoading(false);
    };

    loadPageData();
  }, [router]);

  const handleCheckStatus = async () => {
    setCheckStatusLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }
      
      const response = await fetch(buildApiUrl(API_ENDPOINTS.VERIFY), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const updatedUser = userData.user;
        const updatedBusiness = authConfig.getCurrentBusiness(updatedUser);

        if (updatedUser.clientStatus === 'approved') {
          // Update local storage with new user data
          localStorage.setItem('userData', JSON.stringify(updatedUser));
          router.push('/client/dashboard');
        } else if (updatedBusiness && updatedBusiness.businessId?.status !== 'active') {
          router.push('/client/pending-business-activation');
        } else {
          setError('Your account is still pending approval. Please try again later.');
        }
      } else {
        // Check if response is HTML (404 page)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          setError('API endpoint not found. Please check if the backend server is running.');
        } else {
          // Token might be invalid or expired, force re-login
          authConfig.logout();
          router.push('/client/login');
        }
      }
    } catch (err) {
      console.error('Error checking status:', err);
      if (err.message.includes('Unexpected token')) {
        setError('Server returned invalid response. Please check if the backend server is running.');
      } else {
        setError('Failed to check status. Please try again.');
      }
    } finally {
      setCheckStatusLoading(false);
    }
  };

  const handleLogout = () => {
    authConfig.logout();
    router.push('/client/login');
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-yellow-50 dark:from-slate-900 dark:to-yellow-900">
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-yellow-50 dark:from-slate-900 dark:to-yellow-900">
          <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h1>
            <p className="text-slate-700 dark:text-slate-300 mb-6">{error}</p>
            <button
              onClick={() => router.push('/client/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-yellow-50 dark:from-slate-900 dark:to-yellow-900 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 md:p-12 w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <Logo size="medium" />
          </div>
          
          {/* Pending Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Account Pending Approval</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your client account for{' '}
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">{businessInfo?.name || 'your business'}</span> is currently pending approval by the business administrator.
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            You&apos;ll be able to access your client dashboard once your account has been approved.
          </p>

          {businessInfo && (
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg mb-8 text-left">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Business Details:</h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                <strong>Business Name:</strong> {businessInfo.name}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                <strong>Type:</strong> {businessInfo.businessType}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                <strong>Email:</strong> {businessInfo.email}
              </p>
              {businessInfo.businessCode && (
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Business Code:</strong> <span className="font-mono bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">{businessInfo.businessCode}</span>
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleCheckStatus}
              disabled={checkStatusLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkStatusLoading ? 'Checking Status...' : 'Check Approval Status'}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              Logout
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Contact the business administrator at{' '}
              <a href={`mailto:${businessInfo?.email}`} className="underline hover:no-underline">
                {businessInfo?.email}
              </a>{' '}
              for assistance with your account approval.
            </p>
          </div>
        </div>
        <ThemeToggle className="mt-8" />
      </div>
    </ThemeProvider>
  );
}
