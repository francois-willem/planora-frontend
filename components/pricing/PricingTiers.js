"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import PricingTierCard from "./PricingTierCard";
import { BusinessRegisterButton } from "../BusinessAuthButtons";
import { TIERS, TIER_FEATURES } from "../../lib/tierConstants";

/**
 * Pricing tier configuration
 */
const PRICING_TIERS = [
  {
    id: "basic",
    name: "Basic",
    tier: TIERS.BASIC,
    price: "R500",
    period: "/month",
    description: "Up to 100 client accounts",
    subDescription: "Additional 50 client accounts = +R200",
    features: TIER_FEATURES[TIERS.BASIC],
    isComingSoon: false,
  },
  {
    id: "starter",
    name: "Starter",
    tier: TIERS.STARTER,
    price: null,
    period: "/month",
    description: "Everything in Basic, plus:",
    subDescription: "Up to 150 client accounts",
    features: TIER_FEATURES[TIERS.STARTER],
    isComingSoon: true,
  },
  {
    id: "growth",
    name: "Growth",
    tier: TIERS.GROWTH,
    price: null,
    period: "/month",
    description: "Everything in Starter, plus:",
    subDescription: "Up to 200 client accounts",
    features: TIER_FEATURES[TIERS.GROWTH],
    isComingSoon: true,
  },
];

/**
 * PricingTiers - Orchestrates the animated pricing tier cards
 * 
 * Animation sequence:
 * 1. When section enters viewport, tier cards animate in one by one (staggered)
 * 2. After each card appears, its feature list expands downward
 * 3. Once a card's features finish expanding, the next card starts
 * 4. After initial animation, users can toggle features on individual cards
 * 
 * UX Decision: Allow multiple tiers to be expanded simultaneously.
 * Rationale: Users often want to compare features across tiers side-by-side.
 * Forcing single-expansion would require scrolling back and forth, which
 * degrades the comparison experience on a pricing page.
 */
export default function PricingTiers() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  
  // Track which tier is currently animating (for sequential animation)
  const [currentAnimatingTier, setCurrentAnimatingTier] = useState(-1);
  // Track which tiers have completed their initial animation
  const [completedTiers, setCompletedTiers] = useState(new Set());
  // Track whether the initial sequence is complete
  const [initialSequenceComplete, setInitialSequenceComplete] = useState(false);

  // Start the animation sequence when in view
  useEffect(() => {
    if (isInView && currentAnimatingTier === -1) {
      // Small delay before starting to let the page settle
      const timer = setTimeout(() => {
        setCurrentAnimatingTier(0);
      }, prefersReducedMotion ? 0 : 150);
      return () => clearTimeout(timer);
    }
  }, [isInView, currentAnimatingTier, prefersReducedMotion]);

  // Handle when a tier's feature expansion completes
  const handleFeatureExpansionComplete = (tierIndex) => {
    setCompletedTiers((prev) => new Set([...prev, tierIndex]));
    
    // Start next tier animation after a small delay
    if (tierIndex < PRICING_TIERS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentAnimatingTier(tierIndex + 1);
      }, prefersReducedMotion ? 0 : 100);
      return () => clearTimeout(timer);
    } else {
      // All tiers complete
      setInitialSequenceComplete(true);
    }
  };

  // Card entrance animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.55,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
    >
      {PRICING_TIERS.map((tier, index) => {
        // Determine if this card should be visible
        const shouldShow = currentAnimatingTier >= index;
        // Determine if features should be expanded (only after card animation)
        const shouldExpandFeatures = currentAnimatingTier > index || 
          (currentAnimatingTier === index && shouldShow);
        
        return (
          <motion.div
            key={tier.id}
            initial="hidden"
            animate={shouldShow ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <PricingTierCard
              name={tier.name}
              tier={tier.tier}
              price={tier.price}
              period={tier.period}
              description={tier.description}
              subDescription={tier.subDescription}
              features={tier.features}
              isComingSoon={tier.isComingSoon}
              isInitiallyExpanded={shouldExpandFeatures}
              allowToggle={initialSequenceComplete}
              onFeatureExpansionComplete={() => handleFeatureExpansionComplete(index)}
              ctaButton={
                <BusinessRegisterButton className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Select {tier.name} Plan
                </BusinessRegisterButton>
              }
            />
          </motion.div>
        );
      })}
    </div>
  );
}
