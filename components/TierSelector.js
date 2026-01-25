"use client"
import { useTier } from '../lib/TierContext';
import { TIERS } from '../lib/tierConstants';

export default function TierSelector({ className = "" }) {
  const { userTier, setUserTier } = useTier();

  const handleTierChange = (tier) => {
    setUserTier(tier);
  };

  const tierOptions = [
    { 
      value: TIERS.BASIC, 
      label: 'Basic', 
      selectedBg: '#64748B', // slate-500
      hoverBg: '#f1f5f9',
      hoverText: '#475569'
    },
    { 
      value: TIERS.STARTER, 
      label: 'Starter', 
      selectedBg: '#2563EB', // blue-600
      hoverBg: '#dbeafe',
      hoverText: '#1d4ed8'
    },
    { 
      value: TIERS.GROWTH, 
      label: 'Growth', 
      selectedBg: '#16A34A', // green-600
      hoverBg: '#dcfce7',
      hoverText: '#15803d'
    },
    { 
      value: TIERS.UNLIMITED, 
      label: 'Unlimited', 
      selectedBg: '#7C3AED', // violet-600
      hoverBg: '#ede9fe',
      hoverText: '#6d28d9'
    }
  ];

  return (
    <div 
      className={`p-4 rounded-lg border ${className}`}
      style={{ 
        backgroundColor: 'var(--background-card)', 
        borderColor: 'var(--border)' 
      }}
    >
      <h3 
        className="text-sm font-semibold mb-3"
        style={{ color: 'var(--foreground)' }}
      >
        Demo: Select Your Tier
      </h3>
      <div className="flex flex-wrap gap-2">
        {tierOptions.map((tier) => (
          <button
            key={tier.value}
            onClick={() => handleTierChange(tier.value)}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={
              userTier === tier.value
                ? { 
                    backgroundColor: tier.selectedBg, 
                    color: '#FFFFFF',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                  }
                : { 
                    backgroundColor: 'var(--hover-bg)', 
                    color: 'var(--foreground-secondary)'
                  }
            }
            onMouseEnter={(e) => {
              if (userTier !== tier.value) {
                e.target.style.backgroundColor = tier.hoverBg;
                e.target.style.color = tier.hoverText;
              }
            }}
            onMouseLeave={(e) => {
              if (userTier !== tier.value) {
                e.target.style.backgroundColor = 'var(--hover-bg)';
                e.target.style.color = 'var(--foreground-secondary)';
              }
            }}
          >
            {tier.label}
          </button>
        ))}
      </div>
      <p 
        className="text-xs mt-2"
        style={{ color: 'var(--foreground-secondary)' }}
      >
        Current tier: <span className="font-medium capitalize">{userTier}</span>
      </p>
    </div>
  );
}
