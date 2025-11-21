// app/page.js
"use client"
import { useState, useEffect } from 'react';
import Link from "next/link";
import { ClientLoginButton, ClientRegisterButton } from "../../components/ClientAuthButtons";
import { BusinessLoginButton, BusinessRegisterButton } from "../../components/BusinessAuthButtons";
import { LogoutButton } from "../../components/AuthButton";
import { TierProvider } from "../../lib/TierContext";
import TierSelector from "../../components/TierSelector";
import FeatureWrapper from "../../components/FeatureWrapper";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { TIERS } from "../../lib/tierConstants";
import { authConfig, authState } from "../../lib/auth";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to check and update user state
    const checkAuth = () => {
      const currentUser = authConfig.getCurrentUser();
      // Only update state if user actually changed
      setUser(prevUser => {
        const prevUserId = prevUser?._id || null;
        const currentUserId = currentUser?._id || null;
        // Update if user changed (login/logout) or if both are null but structure differs
        if (prevUserId !== currentUserId || (prevUser === null && currentUser !== null) || (prevUser !== null && currentUser === null)) {
          return currentUser;
        }
        return prevUser;
      });
      setLoading(false);
    };

    // Check initial user state
    checkAuth();

    // Subscribe to authentication state changes
    const unsubscribe = authState.subscribe((currentUser, isLoading) => {
      setUser(currentUser);
      setLoading(isLoading);
    });

    // Listen for storage changes (when user logs in/out from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Check auth state when window regains focus (user might have logged in/out in another tab)
    const handleFocus = () => {
      checkAuth();
    };
    window.addEventListener('focus', handleFocus);

    // Periodic check to catch auth changes (every 1 second)
    // This ensures we catch login/logout even if other events don't fire
    const intervalId = setInterval(() => {
      checkAuth();
    }, 1000);

    // Cleanup
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <TierProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navbar showLogoText={true} />

      {/* Hero Section */}
      <section className="flex-1 flex items-center py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              <span className="hidden sm:inline">Manage clients, sessions, and classes in one place</span>
              <span className="sm:hidden">All-in-one scheduling solution</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600 dark:from-slate-100 dark:via-blue-300 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
            The All-in-One
              <br />
              <span className="text-blue-600 dark:text-blue-400">Scheduling Solution</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Manage classes, track attendance, handle cancellations, and keep instructor notes—all in one powerful, intuitive platform.
            </p>
            
            {/* Tier Selector for Demo */}
            <div className="max-w-md mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
              <TierSelector />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
              <BusinessRegisterButton className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto">
                Start Free Trial
              </BusinessRegisterButton>
              <Link
                href="/pricing"
                className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-semibold text-base sm:text-lg w-full sm:w-auto"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-24 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-blue-800 dark:from-slate-100 dark:to-blue-300 bg-clip-text text-transparent">
              Everything You Need to Manage Your Classes
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4 sm:px-0">
              Streamline your scheduling workflow with our comprehensive suite of tools designed for swim schools and educational institutions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <FeatureWrapper feature="client_profiles" requiredTier={TIERS.BASIC}>
              <div className="group bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 transform hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Client Login</h4>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Secure client portal where students can log in to confirm or cancel their classes with ease.</p>
              </div>
            </FeatureWrapper>
            
            <FeatureWrapper feature="client_cancellations" requiredTier={TIERS.BASIC}>
              <div className="group bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 transform hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Catch-Up Lessons</h4>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Intelligent system that allows cancelled lessons to be taken by other clients as catch-up sessions.</p>
              </div>
            </FeatureWrapper>
            
            <FeatureWrapper feature="class_scheduling" requiredTier={TIERS.BASIC}>
              <div className="group bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 transform hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Schedule Management</h4>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Profiles and sessions are stored securely with real-time synchronization.</p>
              </div>
            </FeatureWrapper>
            
            <FeatureWrapper feature="multiple_staff_accounts" requiredTier={TIERS.GROWTH}>
              <div className="group bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 transform hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Instructor Notes</h4>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Instructors can add detailed notes for each lesson, visible to admin and optionally to clients.</p>
              </div>
            </FeatureWrapper>
          </div>
        </div>
      </section>

      {/* Client Access Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Are You a Client?
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-green-100 dark:text-green-200 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Access your classes, manage your schedule, and stay connected with your instructors.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            {!user && (
              <>
                <ClientRegisterButton 
                  businessSlug="client"
                  className="bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-green-50 transition-all duration-200 font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  Join as Client
                </ClientRegisterButton>
                <Link
                  href="/login"
                  className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white hover:text-green-600 transition-all duration-200 font-semibold text-base sm:text-lg w-full sm:w-auto"
                >
                  Login
                </Link>
              </>
            )}
            {user && (
              <LogoutButton className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white hover:text-green-600 transition-all duration-200 font-semibold text-base sm:text-lg w-full sm:w-auto" />
            )}
          </div>
        </div>
      </section>

      {/* Business CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform Your Scheduling?
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 dark:text-blue-200 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Join swim schools and educational institutions already using Planora to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            {!user && (
              <>
                <BusinessRegisterButton className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-blue-50 transition-all duration-200 font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto">
                  Start Your Free Trial
                </BusinessRegisterButton>
                <Link
                  href="/login"
                  className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-base sm:text-lg w-full sm:w-auto"
                >
                  Login
                </Link>
              </>
            )}
            {user && (
              <LogoutButton className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-base sm:text-lg w-full sm:w-auto" />
            )}
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </TierProvider>
  );
}
