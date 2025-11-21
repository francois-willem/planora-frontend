'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '../../../lib/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';
import Logo from '../../../components/Logo';
// Admin functionality will be handled by Express backend

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
            setIsAdmin(userData.user.role === 'admin');
            await loadData();
          } else {
            localStorage.removeItem('authToken');
            router.push('/admin/login');
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem('authToken');
          router.push('/admin/login');
        }
      } else {
        router.push('/admin/login');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const [businessesResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/businesses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      ]);

      if (businessesResponse.ok) {
        const businessesData = await businessesResponse.json();
        setBusinesses(businessesData.businesses);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleUpdateAccess = async (businessId, isActive, notes = '') => {
    setUpdating(prev => ({ ...prev, [businessId]: true }));
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/businesses/${businessId}/access`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive, notes }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        await loadData(); // Refresh data
        alert(result.message);
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
    const matchesSearch = business.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = business.isActive === true;
    } else if (statusFilter === 'pending') {
      matchesStatus = business.isActive === false;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (business) => {
    if (business.isActive) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Pending</span>;
    }
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading Admin Panel...</p>
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
            <p className="text-slate-600 dark:text-slate-300">You don&apos;t have admin privileges.</p>
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
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Panel</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage all businesses</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
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

        {/* Main Content */}
        <div className="flex-1 py-8">
          <div className="container mx-auto px-6">
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
                      {filteredBusinesses.map((business) => (<tr key={business.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {business.businessName || 'Unnamed Business'}
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
                            {!business.isActive ? (
                              <button
                                onClick={() => handleUpdateAccess(business.id, true, 'Activated by admin')}
                                disabled={updating[business.id]}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                              >
                                {updating[business.id] ? 'Activating...' : 'Activate'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateAccess(business.id, false, 'Deactivated by admin')}
                                disabled={updating[business.id]}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                              >
                                {updating[business.id] ? 'Deactivating...' : 'Deactivate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}