"use client"
import { useState } from 'react';

export default function BusinessDetails({ business, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedBusiness, setEditedBusiness] = useState(business);

  const handleStatusChange = (newStatus) => {
    setEditedBusiness(prev => ({
      ...prev,
      status: newStatus,
      owner: {
        ...prev.owner,
        status: newStatus === 'active' ? 'active' : prev.owner.status
      }
    }));
  };

  const handleTierChange = (newTier) => {
    setEditedBusiness(prev => ({
      ...prev,
      tier: newTier,
      subscription: {
        ...prev.subscription,
        plan: newTier.charAt(0).toUpperCase() + newTier.slice(1)
      }
    }));
  };

  const handleSave = () => {
    // In a real app, this would make an API call to update the business
    console.log('Saving business changes:', editedBusiness);
    setIsEditing(false);
    // Update the original business object
    Object.assign(business, editedBusiness);
  };

  const handleResetAccess = () => {
    if (confirm('Are you sure you want to reset this business owner\'s access? This will require them to set up their account again.')) {
      // In a real app, this would reset the owner's password and send them a new setup email
      console.log('Resetting access for:', business.owner.email);
      alert('Access reset email sent to ' + business.owner.email);
    }
  };

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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'billing', name: 'Billing & Usage', icon: '💳' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'actions', name: 'Admin Actions', icon: '🔧' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{business.name}</h2>
            <p className="text-slate-500 dark:text-slate-400">{business.owner.name} • {business.location.city}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(business.status)}
          {getTierBadge(business.tier)}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isEditing 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Business Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{business.stats.totalClients}</div>
                <div className="text-sm text-blue-500 dark:text-blue-400">Total Clients</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{business.stats.activeClients}</div>
                <div className="text-sm text-green-500 dark:text-green-400">Active Clients</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{business.stats.totalStaff}</div>
                <div className="text-sm text-purple-500 dark:text-purple-400">Staff Members</div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">R{business.stats.monthlyRevenue.toLocaleString()}</div>
                <div className="text-sm text-emerald-500 dark:text-emerald-400">Monthly Revenue</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Business Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {business.name}</div>
                  <div><span className="font-medium">Address:</span> {business.location.address}</div>
                  <div><span className="font-medium">City:</span> {business.location.city}</div>
                  <div><span className="font-medium">Province:</span> {business.location.province}</div>
                  <div><span className="font-medium">Registration Date:</span> {new Date(business.settings.registrationDate).toLocaleDateString()}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Owner Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {business.owner.name}</div>
                  <div><span className="font-medium">Email:</span> {business.owner.email}</div>
                  <div><span className="font-medium">Phone:</span> {business.owner.phone}</div>
                  <div><span className="font-medium">Status:</span> {getStatusBadge(business.owner.status)}</div>
                  <div><span className="font-medium">Last Login:</span> {new Date(business.stats.lastLogin).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Billing & Usage Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Subscription Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Plan:</span>
                    <span className="font-medium">{business.subscription.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Price:</span>
                    <span className="font-medium">R{business.subscription.price}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Billing Cycle:</span>
                    <span className="font-medium capitalize">{business.subscription.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Next Billing:</span>
                    <span className="font-medium">{new Date(business.subscription.nextBilling).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Payment Status:</span>
                    <span className={`font-medium ${
                      business.subscription.paymentStatus === 'paid' ? 'text-green-600' : 
                      business.subscription.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {business.subscription.paymentStatus.charAt(0).toUpperCase() + business.subscription.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Usage Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Client Limit:</span>
                    <span className="font-medium">{business.settings.maxClients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Current Clients:</span>
                    <span className="font-medium">{business.stats.totalClients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Usage:</span>
                    <span className="font-medium">
                      {Math.round((business.stats.totalClients / business.settings.maxClients) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((business.stats.totalClients / business.settings.maxClients) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Business Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Account Status</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Business Status
                    </label>
                    {isEditing ? (
                      <select
                        value={editedBusiness.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-slate-100"
                      >
                        <option value="active">Active</option>
                        <option value="pending_activation">Pending Activation</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    ) : (
                      <div className="text-sm">{getStatusBadge(business.status)}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Subscription Tier
                    </label>
                    {isEditing ? (
                      <select
                        value={editedBusiness.tier}
                        onChange={(e) => handleTierChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-slate-100"
                      >
                        <option value="basic">Basic</option>
                        <option value="starter">Starter</option>
                        <option value="growth">Growth</option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                    ) : (
                      <div className="text-sm">{getTierBadge(business.tier)}</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Enabled Features</h4>
                <div className="space-y-2">
                  {business.settings.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Admin Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-700">
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-4">Account Management</h4>
                <div className="space-y-3">
                  <button
                    onClick={handleResetAccess}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reset Owner Access
                  </button>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    This will reset the owner&apos;s password and send them a new setup email.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-4">Billing Actions</h4>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Send Payment Reminder
                  </button>
                  <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Generate Invoice
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-4">Support Actions</h4>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Send Support Email
                  </button>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Schedule Support Call
                  </button>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-4">Data Management</h4>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Export Business Data
                  </button>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Generate Usage Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
