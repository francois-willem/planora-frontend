'use client';

import { useState } from 'react';
import CookiePreferencesModal from './CookiePreferencesModal';

/**
 * Cookie Settings Button
 * 
 * A button/link that opens the cookie preferences modal.
 * Place this in your footer or settings page to allow users
 * to change their cookie preferences after initial consent.
 * 
 * Usage:
 * - In footer: <CookieSettingsButton variant="link" />
 * - As button: <CookieSettingsButton />
 * 
 * @param {{ className?: string, children?: React.ReactNode, variant?: 'button' | 'link' }} props
 */
export default function CookieSettingsButton({
  className = '',
  children = 'Cookie Settings',
  variant = 'link',
}) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    setShowModal(false);
  };

  const baseStyles = variant === 'link'
    ? 'text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-300 text-sm transition-colors cursor-pointer focus:outline-none focus:underline'
    : 'px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';

  return (
    <>
      <button
        onClick={handleClick}
        className={`${baseStyles} ${className}`}
        aria-label="Open cookie preferences"
      >
        {children}
      </button>

      <CookiePreferencesModal
        isOpen={showModal}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
}
