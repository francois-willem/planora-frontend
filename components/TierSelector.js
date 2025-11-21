"use client"
import { useTier } from '../lib/TierContext';
import { TIERS } from '../lib/tierConstants';

export default function TierSelector({ className = "" }) {
  const { userTier, setUserTier } = useTier();

  const handleTierChange = (tier) => {
    setUserTier(tier);
  };

  const tierOptions = [
    { value: TIERS.BASIC, label: 'Basic', color: 'gray' },
    { value: TIERS.STARTER, label: 'Starter', color: 'blue' },
    { value: TIERS.GROWTH, label: 'Growth', color: 'green' },
    { value: TIERS.UNLIMITED, label: 'Unlimited', color: 'purple' }
  ];

  return (
    <div className={`bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
        Demo: Select Your Tier
      </h3>
      <div className="flex flex-wrap gap-2">
        {tierOptions.map((tier) => (
          <button
            key={tier.value}
            onClick={() => handleTierChange(tier.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              userTier === tier.value
                ? `bg-${tier.color}-600 text-white shadow-lg`
                : `bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-${tier.color}-100 dark:hover:bg-${tier.color}-900/30 hover:text-${tier.color}-700 dark:hover:text-${tier.color}-300`
            }`}
          >
            {tier.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Current tier: <span className="font-medium capitalize">{userTier}</span>
      </p>
    </div>
  );
}
