"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { TIERS } from './tierConstants';

const TierContext = createContext();

export function TierProvider({ children }) {
  const [userTier, setUserTier] = useState(TIERS.BASIC); // Default to basic
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, this would fetch from your backend/authentication system
  useEffect(() => {
    // Simulate loading user tier from backend
    const loadUserTier = async () => {
      try {
        // This would typically be an API call to get user's subscription tier
        // For now, we'll use localStorage or default to starter
        const savedTier = localStorage.getItem('userTier');
        if (savedTier && Object.values(TIERS).includes(savedTier)) {
          setUserTier(savedTier);
        }
      } catch (error) {
        console.error('Error loading user tier:', error);
        setUserTier(TIERS.BASIC);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserTier();
  }, []);

  const updateUserTier = (newTier) => {
    if (Object.values(TIERS).includes(newTier)) {
      setUserTier(newTier);
      localStorage.setItem('userTier', newTier);
    }
  };

  const hasFeature = (feature) => {
    // This would typically check against the user's actual subscription
    // For demo purposes, we'll use the tier constants
    const { TIER_FEATURES } = require('./tierConstants');
    return TIER_FEATURES[userTier]?.includes(feature) || false;
  };

  const canAccessTier = (requiredTier) => {
    const tierHierarchy = {
      [TIERS.BASIC]: 1,
      [TIERS.STARTER]: 2,
      [TIERS.GROWTH]: 3,
      [TIERS.UNLIMITED]: 4
    };
    
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
  };

  const value = {
    userTier,
    setUserTier: updateUserTier,
    isLoading,
    hasFeature,
    canAccessTier
  };

  return (
    <TierContext.Provider value={value}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
}
