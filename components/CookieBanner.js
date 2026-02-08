'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  hasConsentDecision,
  acceptAllCookies,
  rejectNonEssentialCookies,
} from '../lib/cookieConsent';
import CookiePreferencesModal from './CookiePreferencesModal';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check consent on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    // Small delay to ensure cookie is read correctly
    const timer = setTimeout(() => {
      setShowBanner(!hasConsentDecision());
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Listen for consent changes (e.g., from CookieSettingsButton)
  useEffect(() => {
    const handleConsentChange = () => {
      setShowBanner(!hasConsentDecision());
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    return () => window.removeEventListener('cookieConsentChanged', handleConsentChange);
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    rejectNonEssentialCookies();
    setShowBanner(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSavePreferences = () => {
    setShowModal(false);
    setShowBanner(false);
  };

  // Don't render on server or before mounted
  if (!mounted) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
          role="region"
          aria-label="Cookie consent banner"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Gradient accent bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              
              <div className="p-5 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                  {/* Icon and Text */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          We value your privacy
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          We use essential cookies to make our site work. With your permission, we&apos;d also like to use analytics and marketing cookies to improve your experience and help us understand how visitors use our site.{' '}
                          <Link
                            href="/cookies"
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            Learn more
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                    <button
                      onClick={handleOpenModal}
                      className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-600"
                    >
                      Manage preferences
                    </button>
                    <button
                      onClick={handleRejectNonEssential}
                      className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-600"
                    >
                      Reject non-essential
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/25"
                    >
                      Accept all
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <CookiePreferencesModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSavePreferences}
      />
    </>
  );
}
