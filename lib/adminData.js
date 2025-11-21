// Mock data for super admin dashboard
export const mockBusinesses = [
  {
    id: '1',
    name: 'AquaSwim Academy',
    owner: {
      name: 'Sarah Johnson',
      email: 'sarah@aquaswim.co.za',
      phone: '+27 82 123 4567',
      status: 'active'
    },
    status: 'active',
    tier: 'growth',
    subscription: {
      plan: 'Growth',
      price: 2500,
      currency: 'R',
      billingCycle: 'monthly',
      nextBilling: '2024-02-15',
      paymentStatus: 'paid'
    },
    stats: {
      totalClients: 156,
      activeClients: 142,
      totalStaff: 8,
      monthlyRevenue: 45000,
      lastLogin: '2024-01-20T10:30:00Z'
    },
    settings: {
      maxClients: 200,
      features: ['client_profiles', 'class_scheduling', 'email_notifications', 'owner_dashboard', 'client_cancellations', 'multiple_staff_accounts', 'online_payments', 'advanced_reports', 'branded_portal', 'priority_support'],
      registrationDate: '2023-06-15',
      lastActivity: '2024-01-20T14:22:00Z'
    },
    location: {
      address: '123 Ocean Drive, Cape Town, 8001',
      city: 'Cape Town',
      province: 'Western Cape'
    }
  },
  {
    id: '2',
    name: 'Dolphin Swim School',
    owner: {
      name: 'Mike Chen',
      email: 'mike@dolphinswim.co.za',
      phone: '+27 83 987 6543',
      status: 'pending_activation'
    },
    status: 'pending_activation',
    tier: 'basic',
    subscription: {
      plan: 'Basic',
      price: 500,
      currency: 'R',
      billingCycle: 'monthly',
      nextBilling: '2024-02-10',
      paymentStatus: 'pending'
    },
    stats: {
      totalClients: 45,
      activeClients: 38,
      totalStaff: 3,
      monthlyRevenue: 12000,
      lastLogin: '2024-01-18T16:45:00Z'
    },
    settings: {
      maxClients: 50,
      features: ['client_profiles', 'class_scheduling', 'owner_dashboard', 'client_cancellations'],
      registrationDate: '2024-01-10',
      lastActivity: '2024-01-18T16:45:00Z'
    },
    location: {
      address: '456 Beach Road, Durban, 4001',
      city: 'Durban',
      province: 'KwaZulu-Natal'
    }
  },
  {
    id: '3',
    name: 'SwimFast Training Center',
    owner: {
      name: 'Emma Rodriguez',
      email: 'emma@swimfast.co.za',
      phone: '+27 84 555 1234',
      status: 'active'
    },
    status: 'active',
    tier: 'starter',
    subscription: {
      plan: 'Starter',
      price: 1000,
      currency: 'R',
      billingCycle: 'monthly',
      nextBilling: '2024-02-20',
      paymentStatus: 'paid'
    },
    stats: {
      totalClients: 89,
      activeClients: 76,
      totalStaff: 5,
      monthlyRevenue: 28000,
      lastLogin: '2024-01-19T09:15:00Z'
    },
    settings: {
      maxClients: 100,
      features: ['client_profiles', 'class_scheduling', 'email_notifications', 'owner_dashboard', 'client_cancellations'],
      registrationDate: '2023-09-22',
      lastActivity: '2024-01-19T09:15:00Z'
    },
    location: {
      address: '789 Pool Street, Johannesburg, 2000',
      city: 'Johannesburg',
      province: 'Gauteng'
    }
  },
  {
    id: '4',
    name: 'Water Warriors Academy',
    owner: {
      name: 'David Thompson',
      email: 'david@waterwarriors.co.za',
      phone: '+27 85 777 8888',
      status: 'suspended'
    },
    status: 'suspended',
    tier: 'growth',
    subscription: {
      plan: 'Growth',
      price: 2500,
      currency: 'R',
      billingCycle: 'monthly',
      nextBilling: '2024-02-05',
      paymentStatus: 'overdue'
    },
    stats: {
      totalClients: 203,
      activeClients: 0,
      totalStaff: 12,
      monthlyRevenue: 0,
      lastLogin: '2024-01-05T11:20:00Z'
    },
    settings: {
      maxClients: 200,
      features: ['client_profiles', 'class_scheduling', 'email_notifications', 'owner_dashboard', 'client_cancellations', 'multiple_staff_accounts', 'online_payments', 'advanced_reports', 'branded_portal', 'priority_support'],
      registrationDate: '2023-03-10',
      lastActivity: '2024-01-05T11:20:00Z'
    },
    location: {
      address: '321 Aquatic Avenue, Port Elizabeth, 6001',
      city: 'Port Elizabeth',
      province: 'Eastern Cape'
    }
  },
  {
    id: '5',
    name: 'Little Splashers',
    owner: {
      name: 'Lisa Park',
      email: 'lisa@littlesplashers.co.za',
      phone: '+27 86 444 9999',
      status: 'active'
    },
    status: 'active',
    tier: 'basic',
    subscription: {
      plan: 'Basic',
      price: 500,
      currency: 'R',
      billingCycle: 'monthly',
      nextBilling: '2024-02-12',
      paymentStatus: 'paid'
    },
    stats: {
      totalClients: 32,
      activeClients: 28,
      totalStaff: 2,
      monthlyRevenue: 8500,
      lastLogin: '2024-01-20T13:30:00Z'
    },
    settings: {
      maxClients: 50,
      features: ['client_profiles', 'class_scheduling', 'owner_dashboard', 'client_cancellations'],
      registrationDate: '2023-11-08',
      lastActivity: '2024-01-20T13:30:00Z'
    },
    location: {
      address: '654 Kiddie Lane, Pretoria, 0001',
      city: 'Pretoria',
      province: 'Gauteng'
    }
  }
];

export const adminStats = {
  totalBusinesses: mockBusinesses.length,
  activeBusinesses: mockBusinesses.filter(b => b.status === 'active').length,
  pendingActivation: mockBusinesses.filter(b => b.status === 'pending_activation').length,
  suspendedBusinesses: mockBusinesses.filter(b => b.status === 'suspended').length,
  totalClients: mockBusinesses.reduce((sum, b) => sum + b.stats.totalClients, 0),
  totalRevenue: mockBusinesses.reduce((sum, b) => sum + b.stats.monthlyRevenue, 0),
  tierDistribution: {
    basic: mockBusinesses.filter(b => b.tier === 'basic').length,
    starter: mockBusinesses.filter(b => b.tier === 'starter').length,
    growth: mockBusinesses.filter(b => b.tier === 'growth').length,
    unlimited: mockBusinesses.filter(b => b.tier === 'unlimited').length
  }
};
