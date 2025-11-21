"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '../../../lib/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';
import Logo from '../../../components/Logo';
import PasswordChangeModal from '../../../components/PasswordChangeModal';
import { buildApiUrl, API_ENDPOINTS } from '../../../lib/config';
// Super admin functionality will be handled by Express backend

export default function SuperAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [view, setView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify token with backend
          const response = await fetch(buildApiUrl(API_ENDPOINTS.VERIFY), {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
            setIsAdmin(userData.user.role === 'super-admin');
            
            if (userData.user.role === 'super-admin') {
              await loadData();
            } else {
              router.push('/');
            }
          } else {
            localStorage.removeItem('authToken');
            router.push('/login');
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem('authToken');
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const businessesResponse = await fetch(buildApiUrl('/businesses'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (businessesResponse.ok) {
        const businessesData = await businessesResponse.json();
        setBusinesses(businessesData.data || businessesData.businesses || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleUpdateAccess = async (businessId, isActive, notes = '') => {
    setUpdating(prev => ({ ...prev, [businessId]: true }));
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(buildApiUrl(`/businesses/${businessId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: isActive ? 'active' : 'suspended',
          isActive: true, // Keep isActive true for suspended businesses
          notes 
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        await loadData(); // Refresh data
        alert(result.message || 'Business status updated successfully');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating access:', error);
      alert('Error updating business access');
    } finally {
      setUpdating(prev => ({ ...prev, [businessId]: false }));
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = business.status === 'active';
    } else if (statusFilter === 'pending') {
      matchesStatus = business.status === 'pending';
    } else if (statusFilter === 'suspended') {
      matchesStatus = business.status === 'suspended';
    } else if (statusFilter === 'verified') {
      matchesStatus = business.status === 'active'; // For now, treat active as verified
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (business) => {
    if (business.status === 'active') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</span>;
    } else if (business.status === 'suspended') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Suspended</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</span>;
    }
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading Super Admin Panel...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAdmin) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Access Denied</h1>
            <p className="text-slate-600 dark:text-slate-300">You don&apos;t have super admin privileges.</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Logo size="small" />
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Super Admin Panel</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage all businesses and platform operations</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  Change Password
                </button>
                <ThemeToggle />
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Header */}
        {stats && (
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-6">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-500/20 px-4 py-3 rounded-lg">
                  <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
                  <div className="text-sm text-red-100">Total Businesses</div>
                </div>
                <div className="bg-red-500/20 px-4 py-3 rounded-lg">
                  <div className="text-2xl font-bold">{stats.activeBusinesses}</div>
                  <div className="text-sm text-red-100">Active</div>
                </div>
                <div className="bg-red-500/20 px-4 py-3 rounded-lg">
                  <div className="text-2xl font-bold">{stats.pendingBusinesses}</div>
                  <div className="text-sm text-red-100">Pending</div>
                </div>
                <div className="bg-red-500/20 px-4 py-3 rounded-lg">
                  <div className="text-2xl font-bold">{stats.recentRegistrations}</div>
                  <div className="text-sm text-red-100">New This Week</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="container mx-auto px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setView('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  view === 'overview'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setView('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                  view === 'pending'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                Pending Approvals
                {businesses.filter(b => b.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {businesses.filter(b => b.status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setView('businesses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  view === 'businesses'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                All Businesses
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 py-8">
          <div className="container mx-auto px-6">
            {view === 'overview' && stats && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Platform Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Business Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Active</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{stats.activeBusinesses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Pending</span>
                        <span className="font-medium text-yellow-600 dark:text-yellow-400">{stats.pendingBusinesses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Verified</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">{stats.verifiedBusinesses}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Tier Distribution</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Basic</span>
                        <span className="font-medium">{stats.tierDistribution.basic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Starter</span>
                        <span className="font-medium">{stats.tierDistribution.starter}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Growth</span>
                        <span className="font-medium">{stats.tierDistribution.growth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Unlimited</span>
                        <span className="font-medium">{stats.tierDistribution.unlimited}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">New This Week</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{stats.recentRegistrations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total Revenue</span>
                        <span className="font-medium">R{stats.totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'pending' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pending Business Approvals</h2>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {businesses.filter(b => b.status === 'pending').length} businesses awaiting activation
                  </div>
                </div>

                {businesses.filter(b => b.status === 'pending').length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                      <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">All Caught Up!</h3>
                    <p className="text-slate-600 dark:text-slate-400">No businesses are currently pending activation.</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Business
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Registered
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                          {businesses.filter(b => b.status === 'pending').map((business) => (
                            <tr key={business._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {business.name || 'Unnamed Business'}
                                  </div>
                                  <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {business.businessType || 'Business'}
                                  </div>
                                  {business.businessCode && (
                                    <div className="text-xs text-slate-400 dark:text-slate-500">
                                      Code: {business.businessCode}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {business.email}
                                  </div>
                                  <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {business.phone || 'No phone'}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                {business.createdAt ? new Date(business.createdAt).toLocaleDateString() : 'Unknown'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => handleUpdateAccess(business._id, true, 'Activated by super admin')}
                                  disabled={updating[business._id]}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm disabled:opacity-50"
                                >
                                  {updating[business._id] ? 'Activating...' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => handleUpdateAccess(business._id, false, 'Rejected by super admin')}
                                  disabled={updating[business._id]}
                                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm disabled:opacity-50"
                                >
                                  {updating[business._id] ? 'Rejecting...' : 'Reject'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {view === 'businesses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Businesses</h2>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {filteredBusinesses.length} of {businesses.length} businesses
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Search
                      </label>
                      <input
                        type="text"
                        placeholder="Search businesses or emails..."
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
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                        <option value="verified">Verified</option>
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
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Registered
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredBusinesses.map((business) => (
                          <tr key={business._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {business.name || 'Unnamed Business'}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {business.businessType || 'Business'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {business.email}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {business.phone || 'No phone'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(business)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                              {business.createdAt ? new Date(business.createdAt).toLocaleDateString() : 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              {business.status === 'active' ? (
                                <button
                                  onClick={() => handleUpdateAccess(business._id, false, 'Suspended by super admin')}
                                  disabled={updating[business._id]}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                >
                                  {updating[business._id] ? 'Suspending...' : 'Suspend'}
                                </button>
                              ) : business.status === 'suspended' ? (
                                <button
                                  onClick={() => handleUpdateAccess(business._id, true, 'Reactivated by super admin')}
                                  disabled={updating[business._id]}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                                >
                                  {updating[business._id] ? 'Reactivating...' : 'Reactivate'}
                                </button>
                              ) : business.status === 'pending' ? (
                                <button
                                  onClick={() => handleUpdateAccess(business._id, true, 'Activated by super admin')}
                                  disabled={updating[business._id]}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                                >
                                  {updating[business._id] ? 'Activating...' : 'Activate'}
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          console.log('Password changed successfully');
        }}
      />
    </ThemeProvider>
  );
}
