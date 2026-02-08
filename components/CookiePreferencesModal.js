'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { getConsent, setConsent } from '../lib/cookieConsent';

export default function CookiePreferencesModal({
  isOpen,
  onClose,
  onSave,
}) {
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  // Initialize from current consent or default to false
  const currentConsent = getConsent();
  const [analytics, setAnalytics] = useState(currentConsent?.analytics ?? false);
  const [marketing, setMarketing] = useState(currentConsent?.marketing ?? false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const consent = getConsent();
      setAnalytics(consent?.analytics ?? false);
      setMarketing(consent?.marketing ?? false);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Focus trap implementation
  const handleTabKey = useCallback((e) => {
    if (e.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keydown', handleTabKey);
      // Focus first focusable element when modal opens
      setTimeout(() => firstFocusableRef.current?.focus(), 0);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown, handleTabKey]);

  const handleSave = () => {
    setConsent({ analytics, marketing });
    onSave();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2
              id="cookie-preferences-title"
              className="text-xl font-semibold text-slate-900 dark:text-white"
            >
              Cookie Preferences
            </h2>
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close cookie preferences"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage how we use cookies on this site
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Essential Cookies - Always On */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Essential Cookies
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Required for the website to function properly. These cannot be disabled.
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                  Always On
                </span>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${analytics ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  Analytics Cookies
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Help us understand how visitors interact with our website to improve user experience.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="sr-only peer"
                  aria-label="Enable analytics cookies"
                />
                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${marketing ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  Marketing Cookies
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Used to deliver relevant advertisements and track campaign effectiveness.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="sr-only peer"
                  aria-label="Enable marketing cookies"
                />
                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            ref={lastFocusableRef}
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
