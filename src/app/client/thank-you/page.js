// src/app/client/thank-you/page.js
"use client"
import Link from 'next/link';
import { ThemeProvider } from '../../../../lib/ThemeContext';
import ThemeToggle from '../../../../components/ThemeToggle';
import Logo from '../../../../components/Logo';

export default function ClientThankYouPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Logo size="large" className="mb-4" />
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-center">
            <ThemeToggle />
          </div>

          {/* Thank You Content */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Thank You for Registering!
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              Welcome to <span className="font-semibold text-blue-600 dark:text-blue-400">Planora</span>
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Account Activation Required
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your account has been created successfully! The business owner will review and activate your account as soon as possible. You&apos;ll receive an email notification once your account is ready.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p className="mb-2">While you wait, you can:</p>
                <ul className="text-left space-y-1 ml-4">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Check your email for updates
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Contact your business directly if needed
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Learn more about Planora&apos;s features
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/client/login"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
              >
                Try Logging In
              </Link>
              
              <Link
                href="/"
                className="w-full border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-semibold inline-block"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Questions? Contact your business directly
            </p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
