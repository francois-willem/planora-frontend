'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { hasConsent } from '../lib/cookieConsent';

/**
 * Analytics Scripts Component
 * 
 * Only loads analytics scripts after the user has given consent.
 * This component listens for consent changes and dynamically loads/unloads scripts.
 * 
 * Usage: Place this component in your layout instead of directly embedding analytics scripts.
 */

// Environment variable for Google Analytics ID
// In production, replace with your actual GA ID or use env variable
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-VSRXPSNL8N';

export default function AnalyticsScripts() {
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial consent
    setAnalyticsConsent(hasConsent('analytics'));

    // Listen for consent changes
    const handleConsentChange = () => {
      setAnalyticsConsent(hasConsent('analytics'));
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    return () => window.removeEventListener('cookieConsentChanged', handleConsentChange);
  }, []);

  // Don't render anything on server or before mount
  if (!mounted) return null;

  // Only render scripts if analytics consent is given
  if (!analyticsConsent) return null;

  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>

      {/* 
        Vercel Analytics
        Note: Vercel Analytics is privacy-focused by default and doesn't use cookies.
        However, we're gating it behind analytics consent for maximum compliance.
        If you prefer, you can move this outside the consent check.
      */}
      {/* Vercel Analytics is imported as a component - see layout for integration */}
    </>
  );
}

/**
 * Marketing Scripts Component (Example)
 * 
 * This is a separate component for marketing scripts like Facebook Pixel, 
 * Google Ads conversion tracking, etc.
 * 
 * Usage: <MarketingScripts />
 */
export function MarketingScripts() {
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMarketingConsent(hasConsent('marketing'));

    const handleConsentChange = () => {
      setMarketingConsent(hasConsent('marketing'));
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    return () => window.removeEventListener('cookieConsentChanged', handleConsentChange);
  }, []);

  if (!mounted || !marketingConsent) return null;

  return (
    <>
      {/* 
        Example: Facebook Pixel
        Replace YOUR_PIXEL_ID with your actual Facebook Pixel ID
        
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </Script>
      */}

      {/* 
        Example: Google Ads Conversion Tracking
        Replace YOUR_CONVERSION_ID with your actual conversion ID
        
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-YOUR_CONVERSION_ID"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-YOUR_CONVERSION_ID');
          `}
        </Script>
      */}

      {/* Add your marketing scripts here */}
    </>
  );
}
