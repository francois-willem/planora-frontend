/**
 * Cookie Consent Management Utilities
 * POPIA/GDPR-friendly cookie consent system for Planora
 */

const COOKIE_NAME = 'planora_cookie_consent';
const COOKIE_VERSION = 1;
const COOKIE_EXPIRY_DAYS = 180;

/**
 * Check if we're running in a browser environment
 */
const isBrowser = () => typeof window !== 'undefined';

/**
 * Check if we're in production (HTTPS)
 */
const isProduction = () => {
  if (!isBrowser()) return false;
  return window.location.protocol === 'https:';
};

/**
 * Get the current consent preferences from the cookie
 * Returns null if no consent has been given yet
 * @returns {{ version: number, essential: true, analytics: boolean, marketing: boolean, timestamp: string } | null}
 */
export function getConsent() {
  if (!isBrowser()) return null;

  try {
    const cookies = document.cookie.split(';');
    const consentCookie = cookies.find((c) =>
      c.trim().startsWith(`${COOKIE_NAME}=`)
    );

    if (!consentCookie) return null;

    const value = consentCookie.split('=')[1];
    const decoded = decodeURIComponent(value);
    const consent = JSON.parse(decoded);

    // Validate the consent object
    if (
      consent.version !== COOKIE_VERSION ||
      typeof consent.essential !== 'boolean' ||
      typeof consent.analytics !== 'boolean' ||
      typeof consent.marketing !== 'boolean' ||
      typeof consent.timestamp !== 'string'
    ) {
      return null;
    }

    return consent;
  } catch {
    return null;
  }
}

/**
 * Set the consent preferences
 * @param {{ analytics: boolean, marketing: boolean }} consent
 */
export function setConsent(consent) {
  if (!isBrowser()) return;

  const fullConsent = {
    version: COOKIE_VERSION,
    essential: true, // Always true
    analytics: consent.analytics,
    marketing: consent.marketing,
    timestamp: new Date().toISOString(),
  };

  const value = encodeURIComponent(JSON.stringify(fullConsent));
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);

  let cookieString = `${COOKIE_NAME}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

  // Add Secure flag only in production (HTTPS)
  if (isProduction()) {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;

  // Dispatch a custom event so other components can react to consent changes
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: fullConsent }));
}

/**
 * Check if consent has been given for a specific category
 * @param {'essential' | 'analytics' | 'marketing'} category
 * @returns {boolean}
 */
export function hasConsent(category) {
  if (!isBrowser()) return false;

  // Essential cookies are always allowed
  if (category === 'essential') return true;

  const consent = getConsent();
  if (!consent) return false;

  return consent[category] === true;
}

/**
 * Check if any consent decision has been made (banner should be hidden)
 * @returns {boolean}
 */
export function hasConsentDecision() {
  return getConsent() !== null;
}

/**
 * Clear the consent cookie (useful for testing or "reset preferences")
 */
export function clearConsent() {
  if (!isBrowser()) return;

  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: null }));
}

/**
 * Accept all cookies
 */
export function acceptAllCookies() {
  setConsent({ analytics: true, marketing: true });
}

/**
 * Reject all non-essential cookies
 */
export function rejectNonEssentialCookies() {
  setConsent({ analytics: false, marketing: false });
}
