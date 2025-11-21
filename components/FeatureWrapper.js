'use client'
import { useTier } from '../lib/TierContext';
import { TIERS } from '../lib/tierConstants';

export default function FeatureWrapper({ 
  children, 
  feature, 
  requiredTier, 
  fallback = null,
  showUpgrade = true,
  upgradeMessage = "Upgrade to access this feature"
}) {
  const { userTier, hasFeature, canAccessTier, isLoading } = useTier();

  // Show loading state
  if (isLoading) {
    return (
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg p-4">
        <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/2"></div>
      </div>
    );
  }

  // Check if user has access to the feature
  const hasAccess = feature ? hasFeature(feature) : canAccessTier(requiredTier);

  if (hasAccess) {
    return children;
  }

  // Show fallback or upgrade message
  if (fallback) {
    return fallback;
  }

  if (showUpgrade) {
    return (
      <div className="relative group">
        {/* Blurred content */}
        <div className="filter blur-sm pointer-events-none">
          {children}
        </div>
        
        {/* Upgrade overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {getTierDisplayName(requiredTier)} Feature
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              {upgradeMessage}
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-sm">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Helper function to get display name for tiers
function getTierDisplayName(tier) {
  const tierNames = {
    [TIERS.BASIC]: 'Basic',
    [TIERS.STARTER]: 'Starter',
    [TIERS.GROWTH]: 'Growth',
    [TIERS.UNLIMITED]: 'Unlimited'
  };
  return tierNames[tier] || 'Premium';
}

// Higher-order component for easier usage
export function withFeatureAccess(WrappedComponent, feature, requiredTier) {
  return function FeatureWrappedComponent(props) {
    return (
      <FeatureWrapper feature={feature} requiredTier={requiredTier}>
        <WrappedComponent {...props} />
      </FeatureWrapper>
    );
  };
}

// Feature badge component
export function FeatureBadge({ feature, requiredTier, className = "" }) {
  const { hasFeature, canAccessTier } = useTier();
  
  const hasAccess = feature ? hasFeature(feature) : canAccessTier(requiredTier);
  
  if (hasAccess) {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ${className}`}>
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Included
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ${className}`}>
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      {getTierDisplayName(requiredTier)}
    </span>
  );
}
