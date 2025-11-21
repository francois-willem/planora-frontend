// Tier definitions and feature mappings
export const TIERS = {
  BASIC: 'basic',
  STARTER: 'starter',
  GROWTH: 'growth',
  UNLIMITED: 'unlimited'
};

export const TIER_FEATURES = {
  [TIERS.BASIC]: [
    'client_profiles',
    'class_scheduling',
    'owner_dashboard',
    'client_cancellations'
  ],
  [TIERS.STARTER]: [
    'client_profiles',
    'class_scheduling',
    'email_notifications',
    'owner_dashboard',
    'client_cancellations'
  ],
  [TIERS.GROWTH]: [
    'client_profiles',
    'class_scheduling',
    'email_notifications',
    'owner_dashboard',
    'client_cancellations',
    'multiple_staff_accounts',
    'online_payments',
    'advanced_reports',
    'branded_portal',
    'priority_support'
  ],
  [TIERS.UNLIMITED]: [
    'client_profiles',
    'class_scheduling',
    'email_notifications',
    'owner_dashboard',
    'client_cancellations',
    'multiple_staff_accounts',
    'online_payments',
    'advanced_reports',
    'branded_portal',
    'priority_support',
    'unlimited_clients',
    'unlimited_staff',
    'white_label_app',
    'api_integrations',
    'advanced_automation',
    'dedicated_support'
  ]
};

export const FEATURE_DESCRIPTIONS = {
  client_profiles: 'Client profiles and management',
  class_scheduling: 'Class scheduling and calendar',
  email_notifications: 'Email notifications',
  owner_dashboard: 'Owner dashboard and analytics',
  client_cancellations: 'Client cancellation management',
  multiple_staff_accounts: 'Multiple staff accounts',
  online_payments: 'Online payment integration',
  advanced_reports: 'Advanced reporting (capacity, revenue)',
  branded_portal: 'Branded client portal (logo/colors)',
  priority_support: 'Priority customer support',
  unlimited_clients: 'Unlimited client accounts',
  unlimited_staff: 'Unlimited staff accounts',
  white_label_app: 'White-label mobile app',
  api_integrations: 'API integrations',
  advanced_automation: 'Advanced automation features',
  dedicated_support: 'Dedicated account manager'
};

export const TIER_PRICING = {
  [TIERS.BASIC]: {
    price: 500,
    currency: 'R',
    period: 'month',
    clientLimit: 100,
    additionalClientPrice: 200
  },
  [TIERS.STARTER]: {
    price: 1000,
    currency: 'R',
    period: 'month',
    clientLimit: 150,
    additionalClientPrice: 250
  },
  [TIERS.GROWTH]: {
    price: 2500,
    currency: 'R',
    period: 'month',
    clientLimit: 200,
    additionalClientPrice: 300
  },
  [TIERS.UNLIMITED]: {
    price: 'custom',
    currency: 'R',
    period: 'month',
    clientLimit: 'unlimited',
    additionalClientPrice: 0
  }
};
