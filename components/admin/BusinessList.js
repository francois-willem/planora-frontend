"use client"
import { useState } from 'react';

export default function BusinessList({ businesses, onSelectBusiness }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
    const matchesTier = tierFilter === 'all' || business.tier === tierFilter;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Active' },
      pending_activation: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', text: 'Pending' },
      suspended: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', text: 'Suspended' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTierBadge = (tier) => {
    const tierConfig = {
      basic: { color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300', text: 'Basic' },
      starter: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', text: 'Starter' },
      growth: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Growth' },
      unlimited: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', text: 'Unlimited' }
    };
    
    const config = tierConfig[tier] || tierConfig.basic;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Businesses</h2>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {filteredBusinesses.length} of {businesses.length} businesses
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search businesses, owners, or emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-slate-100"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending_activation">Pending Activation</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tier
            </label>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-slate-100"
            >
              <option value="all">All Tiers</option>
              <option value="basic">Basic</option>
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
        </div>
      </div>

      {/* Business List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Clients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredBusinesses.map((business) => (<tr key={business.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {business.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {business.location.city}, {business.location.province}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {business.owner.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {business.owner.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(business.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTierBadge(business.tier)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                    {business.stats.activeClients} / {business.stats.totalClients}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                    R{business.stats.monthlyRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(business.settings.lastActivity).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onSelectBusiness(business)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
