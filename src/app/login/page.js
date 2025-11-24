// src/app/login/page.js
"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '../../../lib/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';
import Logo from '../../../components/Logo';
import { buildApiUrl, API_ENDPOINTS } from '../../../lib/config';

export default function UnifiedLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Handle login with Express backend
      const response = await fetch(buildApiUrl(API_ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Store token and full user data including business information
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userData', JSON.stringify({
          _id: result._id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          role: result.role,
          businessAssociations: result.businessAssociations || [],
          currentBusiness: result.currentBusiness,
          isSuperAdmin: result.isSuperAdmin || false
        }));

        // Redirect based on user role
        switch (result.role) {
          case 'super-admin':
            router.push('/super-admin');
            break;
          case 'admin':
          case 'instructor':
            router.push('/business/dashboard');
            break;
          case 'employee':
            router.push('/employee/dashboard');
            break;
          case 'client':
            router.push('/client/dashboard');
            break;
          default:
            setError('Unknown user role. Please contact support.');
        }
      } else {
        // Handle pending business status
        if (result.businessStatus === 'pending') {
          // Store token and user data even for pending businesses
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userData', JSON.stringify({
            _id: result._id,
            email: result.email,
            role: result.role,
            businessAssociations: result.businessAssociations || [],
            currentBusiness: result.currentBusiness,
            isSuperAdmin: result.isSuperAdmin || false
          }));
          // Redirect to pending approval page for business admins
          if (result.role === 'admin') {
            router.push('/business/pending-approval');
          } else {
            setError(`Your business "${result.businessName}" is pending activation. Please wait for super admin approval.`);
          }
        } else if (result.businessStatus === 'suspended') {
          // Store token and user data even for suspended businesses
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userData', JSON.stringify({
            _id: result._id,
            email: result.email,
            role: result.role,
            businessAssociations: result.businessAssociations || [],
            currentBusiness: result.currentBusiness,
            isSuperAdmin: result.isSuperAdmin || false
          }));
          // Redirect to account suspended page for business admins
          if (result.role === 'admin') {
            router.push('/business/account-suspended');
          } else {
            setError(`Your business "${result.businessName}" has been suspended. Please contact support for assistance.`);
          }
        } else {
          // Handle client status responses
          if (result.clientStatus === 'pending') {
            // Store token and user data even for pending clients
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userData', JSON.stringify({
              _id: result._id,
              email: result.email,
              role: result.role,
              businessAssociations: result.businessAssociations || [],
              currentBusiness: result.currentBusiness,
              isSuperAdmin: result.isSuperAdmin || false
            }));
            // Redirect to pending approval page for clients
            if (result.role === 'client') {
              router.push('/client/pending-approval');
            } else {
              setError(`Your account is pending approval by the business administrator.`);
            }
          } else if (result.clientStatus === 'suspended') {
            setError(`Your account has been suspended. Please contact the business administrator for assistance.`);
          } else if (result.employeeStatus === 'pending') {
            // Store token and user data even for pending employees
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userData', JSON.stringify({
              _id: result._id,
              email: result.email,
              role: result.role,
              businessAssociations: result.businessAssociations || [],
              currentBusiness: result.currentBusiness,
              isSuperAdmin: result.isSuperAdmin || false
            }));
            // Redirect to pending approval page for employees
            router.push('/employee/pending-approval');
          } else if (result.employeeStatus === 'rejected') {
            setError(`Your employee account has been rejected. ${result.rejectionReason ? `Reason: ${result.rejectionReason}` : ''} Please contact the business administrator for more information.`);
          } else if (result.employeeStatus === 'suspended') {
            setError(`Your employee account has been suspended. Please contact the business administrator for assistance.`);
          } else {
            setError(result.message || 'Login failed. Please check your credentials.');
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Logo size="large" className="mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Welcome to Planora
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Sign in to your account
            </p>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-center">
            <ThemeToggle />
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              <div className="mt-4 text-center space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Don&apos;t have an account?{' '}
                  <Link href="/client/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    Sign up as a client
                  </Link>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Business owner?{' '}
                  <Link href="/business/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    Register your business
                  </Link>
                </p>
              </div>
            </div>
          </form>

          {/* Back to Home */}
          <div className="text-center">
            <Link href="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              ← Back to Planora Home
            </Link>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

