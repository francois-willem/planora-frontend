'use client'
import { adminStats } from '../../lib/adminData';

export default function AdminStats({ businesses }) {
  const stats = {
    totalBusinesses: businesses.length,
    activeBusinesses: businesses.filter(b => b.status === 'active').length,
    pendingActivation: businesses.filter(b => b.status === 'pending_activation').length,
    suspendedBusinesses: businesses.filter(b => b.status === 'suspended').length,
    totalClients: businesses.reduce((sum, b) => sum + b.stats.totalClients, 0),
    totalRevenue: businesses.reduce((sum, b) => sum + b.stats.monthlyRevenue, 0),
    tierDistribution: {
      basic: businesses.filter(b => b.tier === 'basic').length,
      starter: businesses.filter(b => b.tier === 'starter').length,
      growth: businesses.filter(b => b.tier === 'growth').length,
      unlimited: businesses.filter(b => b.tier === 'unlimited').length
    }
  };

  const statCards = [
    {
      title: 'Total Businesses',
      value: stats.totalBusinesses,
      icon: '🏢',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Active Businesses',
      value: stats.activeBusinesses,
      icon: '✅',
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Pending Activation',
      value: stats.pendingActivation,
      icon: '⏳',
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Suspended',
      value: stats.suspendedBusinesses,
      icon: '🚫',
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Total Clients',
      value: stats.totalClients.toLocaleString(),
      icon: '👥',
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Monthly Revenue',
      value: `R${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'emerald',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} p-6 rounded-xl border border-slate-200 dark:border-slate-700`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Distribution */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Tier Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.tierDistribution.basic}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Basic</div>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.tierDistribution.starter}</div>
              <div className="text-sm text-blue-500 dark:text-blue-400">Starter</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.tierDistribution.growth}</div>
              <div className="text-sm text-green-500 dark:text-green-400">Growth</div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.tierDistribution.unlimited}</div>
              <div className="text-sm text-purple-500 dark:text-purple-400">Unlimited</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="space-y-4">
            {businesses
              .sort((a, b) => new Date(b.settings.lastActivity) - new Date(a.settings.lastActivity))
              .slice(0, 5)
              .map((business) => (
                <div key={business.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      business.status === 'active' ? 'bg-green-500' :
                      business.status === 'pending_activation' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{business.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {business.owner.name} • {business.tier.charAt(0).toUpperCase() + business.tier.slice(1)} Plan
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(business.settings.lastActivity).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {business.stats.totalClients} clients
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
