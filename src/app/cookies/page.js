'use client';

import Link from 'next/link';
import CookieSettingsButton from '../../../components/CookieSettingsButton';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Cookie Policy
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-10">
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              This Cookie Policy explains how Planora uses cookies and similar technologies 
              to recognise you when you visit our website. It explains what these technologies 
              are and why we use them, as well as your rights to control our use of them.
            </p>
          </section>

          {/* What are cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              What are cookies?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Cookies are small data files that are placed on your computer or mobile device 
              when you visit a website. They are widely used by website owners to make their 
              websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
          </section>

          {/* Cookie Categories */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              Types of cookies we use
            </h2>

            {/* Essential */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Essential Cookies
                </h3>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                  Always active
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                These cookies are strictly necessary for the website to function properly. 
                They enable core functionality such as security, session management, and accessibility. 
                You cannot opt out of these cookies as the website would not function properly without them.
              </p>
              <div className="text-sm text-slate-500 dark:text-slate-500">
                <strong>Examples:</strong> Authentication cookies, security tokens, session identifiers
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-3 h-3 bg-blue-500 rounded-full" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Analytics Cookies
                </h3>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Requires consent
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                These cookies help us understand how visitors interact with our website by 
                collecting and reporting information anonymously. This helps us improve our 
                website and provide a better user experience.
              </p>
              <div className="text-sm text-slate-500 dark:text-slate-500">
                <strong>Examples:</strong> Google Analytics, page view tracking, error monitoring
              </div>
            </div>

            {/* Marketing */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-3 h-3 bg-purple-500 rounded-full" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Marketing Cookies
                </h3>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Requires consent
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                These cookies are used to track visitors across websites and display ads 
                that are relevant and engaging for individual users. They also help measure 
                the effectiveness of advertising campaigns.
              </p>
              <div className="text-sm text-slate-500 dark:text-slate-500">
                <strong>Examples:</strong> Facebook Pixel, Google Ads, retargeting cookies
              </div>
            </div>
          </section>

          {/* Managing preferences */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Managing your cookie preferences
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              You can change your cookie preferences at any time by clicking the button below. 
              You can also find a &quot;Cookie Settings&quot; link in the footer of every page.
            </p>
            <CookieSettingsButton variant="button" className="mt-2" />
          </section>

          {/* Browser settings */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Browser cookie settings
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Most web browsers allow you to control cookies through their settings preferences. 
              However, if you limit the ability of websites to set cookies, you may worsen your 
              overall user experience, since some features may no longer work properly.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Questions?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If you have any questions about our use of cookies or other technologies, 
              please contact us at{' '}
              <a
                href="mailto:privacy@planora.co.za"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                privacy@planora.co.za
              </a>
            </p>
          </section>

          {/* Compliance note */}
          <section className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              POPIA & GDPR Compliance
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This website complies with the Protection of Personal Information Act (POPIA) 
              and the General Data Protection Regulation (GDPR). We only process personal data 
              with your explicit consent for non-essential cookies, and you can withdraw your 
              consent at any time.
            </p>
          </section>
        </div>
      </main>

      {/* Simple footer for this page */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} Planora. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Home
            </Link>
            <CookieSettingsButton variant="link" />
          </div>
        </div>
      </footer>
    </div>
  );
}
