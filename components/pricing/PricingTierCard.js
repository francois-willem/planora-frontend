"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FeatureBadge } from "../FeatureWrapper";
import { FEATURE_DESCRIPTIONS } from "../../lib/tierConstants";

/**
 * ChevronIcon - Animated chevron for expand/collapse indication
 */
function ChevronIcon({ isExpanded, reducedMotion }) {
  return (
    <motion.svg
      className="w-5 h-5 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      animate={{ rotate: isExpanded ? 180 : 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.25,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </motion.svg>
  );
}

/**
 * FeatureList - Animated feature list with staggered items
 */
function FeatureList({ features, tier, isExpanded, reducedMotion, onAnimationComplete }) {
  const containerVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: reducedMotion ? 0 : 0.35, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: reducedMotion ? 0 : 0.2 },
      },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: reducedMotion ? 0 : 0.4, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : 0.1 },
        staggerChildren: reducedMotion ? 0 : 0.06,
        delayChildren: reducedMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    collapsed: {
      opacity: 0,
      y: reducedMotion ? 0 : -8,
    },
    expanded: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          key="feature-list"
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
          variants={containerVariants}
          onAnimationComplete={onAnimationComplete}
          className="overflow-hidden"
        >
          <div className="space-y-4 pt-2 pb-2">
            {features.map((feature) => (
              <motion.div
                key={feature}
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-slate-700 dark:text-slate-300">
                    {FEATURE_DESCRIPTIONS[feature]}
                  </span>
                </div>
                <FeatureBadge feature={feature} requiredTier={tier} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * PricingTierCard - Individual pricing tier card with animated feature expansion
 * 
 * @param {Object} props
 * @param {string} props.name - Tier name (e.g., "Basic", "Starter", "Growth")
 * @param {string} props.tier - Tier constant value
 * @param {string|number} props.price - Price display (e.g., "R500" or "Coming Soon")
 * @param {string} props.period - Billing period (e.g., "/month")
 * @param {string} props.description - Short description
 * @param {string} props.subDescription - Additional description line
 * @param {string[]} props.features - Array of feature keys
 * @param {React.ReactNode} props.ctaButton - Call-to-action button
 * @param {boolean} props.isComingSoon - Whether this tier is coming soon
 * @param {boolean} props.isInitiallyExpanded - Whether features start expanded
 * @param {boolean} props.allowToggle - Whether user can toggle features
 * @param {function} props.onFeatureExpansionComplete - Callback when feature animation completes
 */
export default function PricingTierCard({
  name,
  tier,
  price,
  period = "/month",
  description,
  subDescription,
  features,
  ctaButton,
  isComingSoon = false,
  isInitiallyExpanded = true,
  allowToggle = true,
  onFeatureExpansionComplete,
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const [hasAnimatedOnce, setHasAnimatedOnce] = useState(false);

  // Update expanded state when isInitiallyExpanded changes (for orchestrated animations)
  useEffect(() => {
    setIsExpanded(isInitiallyExpanded);
  }, [isInitiallyExpanded]);

  const handleToggle = () => {
    if (allowToggle && hasAnimatedOnce) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleAnimationComplete = (definition) => {
    if (definition === "expanded" && !hasAnimatedOnce) {
      setHasAnimatedOnce(true);
      onFeatureExpansionComplete?.();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300 relative flex flex-col">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {name}
        </h4>
        
        {isComingSoon ? (
          <div className="mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              Coming Soon
            </div>
          </div>
        ) : (
          <div className="mb-2">
            <span className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {price}
            </span>
            <span className="text-slate-600 dark:text-slate-300">{period}</span>
          </div>
        )}
        
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {description}
          </p>
        )}
        {subDescription && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subDescription}
          </p>
        )}
      </div>

      {/* Features Toggle Header */}
      {allowToggle && hasAnimatedOnce && (
        <button
          onClick={handleToggle}
          className="flex items-center justify-between w-full py-2 px-1 mb-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
          aria-expanded={isExpanded}
        >
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {isExpanded ? "Hide features" : "Show features"}
          </span>
          <ChevronIcon isExpanded={isExpanded} reducedMotion={prefersReducedMotion} />
        </button>
      )}

      {/* Feature List */}
      <div className="flex-1 mb-8">
        <FeatureList
          features={features}
          tier={tier}
          isExpanded={isExpanded}
          reducedMotion={prefersReducedMotion}
          onAnimationComplete={handleAnimationComplete}
        />
      </div>

      {/* CTA Button */}
      <div className="mt-auto">
        {ctaButton}
      </div>
    </div>
  );
}
