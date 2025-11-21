'use client' // This directive tells Next.js this component runs on the client side
import { useState, useEffect } from 'react'; // React hook for managing component state
import Link from 'next/link'; // Next.js component for client-side navigation
import Logo from './Logo'; // Custom logo component
import ThemeToggle from './ThemeToggle'; // Dark/light mode toggle component
import UserProfile from './UserProfile'; // User profile dropdown component
import { BusinessLoginButton, BusinessRegisterButton } from './BusinessAuthButtons'; // Business-specific auth buttons
import { authState, authConfig } from '../lib/auth'; // Authentication utilities

// Navbar component - the main navigation bar for the application
// This component is highly customizable through props
export default function Navbar({ 
  variant = "default", // Visual style variant: "default", "compact", or "minimal"
  logoSize = "large", // Size of the logo: "large", "medium", or "small"
  showAuth = true, // Whether to show authentication buttons
  showThemeToggle = true, // Whether to show dark/light mode toggle
  showNavigation = true, // Whether to show navigation links
  showLogoText = false, // Whether to show text next to logo
  userInfo = null, // User information to display (for dashboard pages)
  className = "" // Additional CSS classes
}) {
  // State to control mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    // Function to check and update login state
    const checkAuth = () => {
      const currentUser = authConfig.getCurrentUser();
      setIsLoggedIn(!!currentUser);
    };

    // Check initial user state
    checkAuth();

    // Subscribe to authentication state changes
    const unsubscribe = authState.subscribe((currentUser, isLoading) => {
      setIsLoggedIn(!!currentUser);
    });

    // Listen for storage changes (when user logs in/out from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Check auth state when window regains focus
    const handleFocus = () => {
      checkAuth();
    };
    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Define different visual styles for the navbar
  const variants = {
    default: {
      container: "py-4", // Standard padding
      height: "h-auto" // Auto height
    },
    compact: {
      container: "h-full", // Full height container
      height: "h-24" // Fixed height of 24 units
    },
    minimal: {
      container: "py-2", // Minimal padding
      height: "h-auto" // Auto height
    }
  };

  // Get the current variant's styling
  const currentVariant = variants[variant];

  // Function to toggle mobile menu open/closed state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle the boolean value
  };

  return (
    /* Main navigation bar with semi-transparent background and blur effect */
    <nav className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 ${className}`}>
      {/* Container with responsive padding and flex layout */}
      <div className={`container mx-auto px-4 sm:px-6 flex justify-between items-center ${currentVariant.container}`}>
        {/* Logo component with customizable size and text */}
        <Logo size={logoSize} showText={showLogoText} />
        
        {/* Desktop Navigation - hidden on mobile, visible on medium screens and up */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Navigation Links - only shown if showNavigation prop is true */}
          {showNavigation && (
            <div className="flex items-center space-x-8">
              {/* Home page link */}
              <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                Home
              </Link>
              {/* Pricing page link */}
              <Link href="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                Pricing
              </Link>
            </div>
          )}
          
          {/* Theme Toggle - only shown if showThemeToggle prop is true */}
          {showThemeToggle && <ThemeToggle />}
          
          {/* User Info - displayed on dashboard pages when user is logged in */}
          {userInfo && (
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userInfo.welcome}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{userInfo.role}</p>
            </div>
          )}
          
          {/* Authentication Section - only shown if showAuth is true and user is not logged in */}
          {showAuth && !userInfo && !isLoggedIn && (
            <div className="flex items-center space-x-4">
              {/* User profile dropdown component */}
              <UserProfile />
              <div className="flex items-center space-x-3">
                {/* Login link */}
                <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                  Login
                </Link>
                {/* Business registration button with gradient styling */}
                <BusinessRegisterButton className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" />
              </div>
            </div>
          )}
          {/* Show UserProfile when logged in but userInfo is not provided */}
          {showAuth && !userInfo && isLoggedIn && (
            <UserProfile />
          )}
        </div>

        {/* Mobile Menu Button - only visible on mobile devices */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Theme toggle for mobile */}
          {showThemeToggle && <ThemeToggle />}
          {/* Hamburger menu button */}
          <button
            onClick={toggleMobileMenu} // Toggle mobile menu when clicked
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            aria-label="Toggle mobile menu" // Accessibility label for screen readers
          >
            {/* Dynamic icon - hamburger when closed, X when open */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                /* X icon when menu is open */
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                /* Hamburger icon when menu is closed */
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - only shown when isMobileMenuOpen is true */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="px-4 py-4 space-y-4">
            {/* Navigation Links - same as desktop but stacked vertically */}
            {showNavigation && (
              <div className="space-y-3">
                {/* Home link - closes menu when clicked */}
                <Link 
                  href="/" 
                  className="block text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu when link is clicked
                >
                  Home
                </Link>
                {/* Pricing link - closes menu when clicked */}
                <Link 
                  href="/pricing" 
                  className="block text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu when link is clicked
                >
                  Pricing
                </Link>
              </div>
            )}
            
            {/* User Info - displayed on dashboard pages when user is logged in */}
            {userInfo && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userInfo.welcome}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userInfo.role}</p>
              </div>
            )}
            
            {/* Authentication Section - only shown if showAuth is true and user is not logged in */}
            {showAuth && !userInfo && !isLoggedIn && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
                {/* User profile dropdown component */}
                <UserProfile />
                <div className="space-y-2">
                  {/* Login link - closes menu when clicked */}
                  <Link 
                    href="/login" 
                    className="block text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu when link is clicked
                  >
                    Login
                  </Link>
                  {/* Business registration button - full width on mobile */}
                  <BusinessRegisterButton 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu when button is clicked
                  />
                </div>
              </div>
            )}
            {/* Show UserProfile when logged in but userInfo is not provided */}
            {showAuth && !userInfo && isLoggedIn && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <UserProfile />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
