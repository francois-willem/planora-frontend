// src/app/business/dashboard.tsx
"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeProvider } from '../../../../lib/ThemeContext';
import Navbar from '../../../../components/Navbar';
import BusinessSelector from '../../../../components/BusinessSelector';
import PasswordChangeModal from '../../../../components/PasswordChangeModal';
import ClassManagement from '../../../../components/ClassManagement';
import EmployeeManagement from '../../../../components/EmployeeManagement';
import SessionManagement from '../../../../components/SessionManagement';
import { authConfig } from '../../../../lib/auth';
import { buildApiUrl } from '../../../../lib/config';

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    email: '',
    type: '',
    address: '',
    businessCode: ''
  });
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalClients: 0,
      totalInstructors: 0,
      totalClasses: 0
    },
    upcomingClasses: []
  });
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsError, setClientsError] = useState('');
  const [pendingClients, setPendingClients] = useState([]);
  const [pendingClientsLoading, setPendingClientsLoading] = useState(false);
  const [pendingClientsError, setPendingClientsError] = useState('');
  const [pendingCatchUpApprovals, setPendingCatchUpApprovals] = useState([]);
  const [pendingCatchUpLoading, setPendingCatchUpLoading] = useState(false);
  const [pendingCatchUpError, setPendingCatchUpError] = useState('');
  const [catchUpRequests, setCatchUpRequests] = useState([]);
  const [catchUpRequestsLoading, setCatchUpRequestsLoading] = useState(false);
  const [catchUpRequestsError, setCatchUpRequestsError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch business dashboard data from API
  const fetchBusinessDashboardData = async (businessId) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Fetching dashboard data for business ID:', businessId); // Debug log
      console.log('Using token:', token ? `Token exists (${token.substring(0, 20)}...)` : 'No token'); // Debug log
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }
      
      const response = await fetch(buildApiUrl(`/businesses/${businessId}/dashboard`), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Business-ID': businessId,
        },
      });

      console.log('API Response status:', response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data received:', data); // Debug log
        setDashboardData(data.data);
        
        // Process notifications for recent activities
        if (data.data.notifications) {
          const formattedNotifications = data.data.notifications.map(notification => ({
            type: notification.type,
            message: notification.message,
            time: new Date(notification.createdAt).toLocaleString(),
            isRead: notification.isRead
          }));
          setRecentActivities(formattedNotifications);
        }
        
        // Update business info with complete data from API
        if (data.data.business) {
          setBusinessInfo(prev => ({
            ...prev,
            name: data.data.business.name,
            email: data.data.business.email,
            type: data.data.business.businessType,
            address: data.data.business.address || '',
            businessCode: data.data.business.businessCode || ''
          }));
        }
        
        setError('');
      } else {
        console.error('API Response status:', response.status);
        console.error('API Response headers:', Object.fromEntries(response.headers.entries()));
        
        let errorData;
        try {
          const responseText = await response.text();
          console.error('API Response text:', responseText);
          
          if (responseText) {
            errorData = JSON.parse(responseText);
          } else {
            errorData = { message: 'Empty response from server' };
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = { message: 'Invalid response format from server' };
        }
        
        console.error('API Error:', errorData); // Debug log
        setError(errorData.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Network error. Please try again.');
    }
  };

  // Fetch clients for the business
  const fetchClients = async (businessId) => {
    try {
      setClientsLoading(true);
      setClientsError('');
      
      const token = localStorage.getItem('authToken');
      console.log('Fetching clients for business ID:', businessId);
      
      const response = await fetch(buildApiUrl('/clients'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Business-ID': businessId,
        },
      });

      console.log('Clients API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Clients data received:', data);
        setClients(data.data || []);
      } else {
        const errorData = await response.json();
        console.error('Clients API Error:', errorData);
        setClientsError(errorData.message || 'Failed to fetch clients');
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setClientsError('Network error. Please try again.');
    } finally {
      setClientsLoading(false);
    }
  };

  // Fetch pending catch-up approvals
  const fetchPendingCatchUpApprovals = async (businessId) => {
    try {
      setPendingCatchUpLoading(true);
      setPendingCatchUpError('');
      
      const token = localStorage.getItem('authToken');
      console.log('Fetching pending catch-up approvals for business ID:', businessId);
      
      const response = await fetch(buildApiUrl('/clients/pending-catchup-approval'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Pending catch-up API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Pending catch-up data received:', data);
        setPendingCatchUpApprovals(data.data || []);
        setPendingCatchUpError('');
      } else {
        const errorData = await response.json();
        console.error('Pending catch-up API Error:', errorData);
        setPendingCatchUpError(errorData.message || 'Failed to fetch pending catch-up approvals');
      }
    } catch (err) {
      console.error('Error fetching pending catch-up approvals:', err);
      setPendingCatchUpError('Network error. Please try again.');
    } finally {
      setPendingCatchUpLoading(false);
    }
  };

  // Fetch all catch-up requests with cancelled lesson details
  const fetchCatchUpRequests = async (businessId) => {
    try {
      setCatchUpRequestsLoading(true);
      setCatchUpRequestsError('');
      
      const token = localStorage.getItem('authToken');
      
      if (!businessId) {
        console.error('No businessId provided to fetchCatchUpRequests');
        setCatchUpRequestsError('Business ID is required');
        setCatchUpRequests([]);
        setCatchUpRequestsLoading(false);
        return;
      }
      
      if (!token) {
        console.error('No auth token found');
        setCatchUpRequestsError('Authentication required');
        setCatchUpRequests([]);
        setCatchUpRequestsLoading(false);
        return;
      }
      
      console.log('Fetching catch-up requests for business ID:', businessId);
      const catchupRequestsUrl = buildApiUrl('/clients/catchup-requests');
      console.log('Request URL:', catchupRequestsUrl);
      
      const response = await fetch(catchupRequestsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Business-ID': businessId,
        },
      });

      console.log('Catch-up requests API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Catch-up requests data received:', data);
        // Handle both success cases: empty array or data array
        if (data.success && Array.isArray(data.data)) {
          setCatchUpRequests(data.data);
          setCatchUpRequestsError('');
        } else {
          console.warn('Unexpected response format:', data);
          setCatchUpRequests([]);
          setCatchUpRequestsError('');
        }
      } else {
        let errorData = {};
        try {
          const responseText = await response.text();
          console.log('Error response text:', responseText);
          if (responseText) {
            errorData = JSON.parse(responseText);
          } else {
            errorData = { message: `Server error: ${response.status} ${response.statusText}` };
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }
        console.error('Catch-up requests API Error:', errorData);
        setCatchUpRequestsError(errorData.message || `Failed to fetch catch-up requests (${response.status})`);
        // Set empty array on error so UI doesn't break
        setCatchUpRequests([]);
      }
    } catch (err) {
      console.error('Error fetching catch-up requests:', err);
      setCatchUpRequestsError('Network error. Please try again.');
      // Set empty array on network error so UI doesn't break
      setCatchUpRequests([]);
    } finally {
      setCatchUpRequestsLoading(false);
    }
  };

  // Approve catch-up for a specific cancelled session
  const approveCatchUpSession = async (notificationId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(buildApiUrl(`/clients/catchup-approve-session/${notificationId}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Catch-up session approved:', data);
        // Refresh catch-up requests
        const currentBusiness = authConfig.getCurrentBusiness(user);
        if (currentBusiness) {
          await fetchCatchUpRequests(currentBusiness.businessId._id);
        }
        alert('Catch-up access approved for this session!');
      } else {
        const errorData = await response.json();
        console.error('Error approving catch-up session:', errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error approving catch-up session:', err);
      alert('Network error. Please try again.');
    }
  };

  // Reject catch-up for a specific cancelled session
  const rejectCatchUpSession = async (notificationId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(buildApiUrl(`/clients/catchup-reject-session/${notificationId}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Catch-up session rejected:', data);
        // Refresh catch-up requests
        const currentBusiness = authConfig.getCurrentBusiness(user);
        if (currentBusiness) {
          await fetchCatchUpRequests(currentBusiness.businessId._id);
        }
        alert('Catch-up access rejected for this session.');
      } else {
        const errorData = await response.json();
        console.error('Error rejecting catch-up session:', errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error rejecting catch-up session:', err);
      alert('Network error. Please try again.');
    }
  };

  // Approve client catch-up access (legacy - for all sessions)
  const approveCatchUpAccess = async (clientId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(buildApiUrl(`/clients/${clientId}/catchup-approve`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Catch-up approved:', data);
        // Refresh pending catch-up approvals and catch-up requests
        const currentBusiness = authConfig.getCurrentBusiness(user);
        if (currentBusiness) {
          await fetchPendingCatchUpApprovals(currentBusiness.businessId._id);
          await fetchCatchUpRequests(currentBusiness.businessId._id);
        }
        alert('Catch-up access approved successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error approving catch-up:', errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error approving catch-up:', err);
      alert('Network error. Please try again.');
    }
  };

  // Reject client catch-up access
  const rejectCatchUpAccess = async (clientId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(buildApiUrl(`/clients/${clientId}/catchup-reject`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Catch-up rejected:', data);
        // Refresh pending catch-up approvals and catch-up requests
        const currentBusiness = authConfig.getCurrentBusiness(user);
        if (currentBusiness) {
          await fetchPendingCatchUpApprovals(currentBusiness.businessId._id);
          await fetchCatchUpRequests(currentBusiness.businessId._id);
        }
        alert('Catch-up access rejected.');
      } else {
        const errorData = await response.json();
        console.error('Error rejecting catch-up:', errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error rejecting catch-up:', err);
      alert('Network error. Please try again.');
    }
  };

  // Fetch pending client requests for the business
  const fetchPendingClients = async (businessId) => {
    try {
      setPendingClientsLoading(true);
      setPendingClientsError('');
      
      const token = localStorage.getItem('authToken');
      console.log('Fetching pending clients for business ID:', businessId);
      
      const response = await fetch(buildApiUrl(`/businesses/${businessId}/pending-requests`), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Pending clients API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Pending clients data received:', data);
        setPendingClients(data.data || []);
        setPendingClientsError('');
      } else {
        const errorData = await response.json();
        console.error('Pending clients API Error:', errorData);
        setPendingClientsError(errorData.message || 'Failed to fetch pending clients');
      }
    } catch (err) {
      console.error('Error fetching pending clients:', err);
      setPendingClientsError('Network error. Please try again.');
    } finally {
      setPendingClientsLoading(false);
    }
  };

  // Approve a pending client request
  const approveClientRequest = async (businessId, userId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(buildApiUrl(`/businesses/${businessId}/approve-request`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: 'client' }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Client approved:', data);
        // Refresh both pending clients and regular clients
        await fetchPendingClients(businessId);
        await fetchClients(businessId);
        alert('Client approved successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error approving client:', errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error approving client:', err);
      alert('Network error. Please try again.');
    }
  };

  // Reject a pending client request
  const rejectClientRequest = async (businessId, userId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(buildApiUrl(`/businesses/${businessId}/reject-request`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Client rejected:', data);
        // Refresh pending clients
        await fetchPendingClients(businessId);
        alert('Client request rejected.');
      } else {
        const errorData = await response.json();
        console.error('Error rejecting client:', errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error rejecting client:', err);
      alert('Network error. Please try again.');
    }
  };

  // Suspend a client
  const suspendClient = async (clientId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(buildApiUrl(`/clients/${clientId}/status`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientStatus: 'suspended' }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Client suspended:', data);
        // Refresh clients list
        const currentBusiness = authConfig.getCurrentBusiness(user);
        if (currentBusiness) {
          await fetchClients(currentBusiness.businessId._id);
        }
        alert('Client account suspended successfully.');
      } else {
        const errorData = await response.json();
        console.error('Error suspending client:', errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error suspending client:', err);
      alert('Network error. Please try again.');
    }
  };

  // Reactivate a client
  const reactivateClient = async (clientId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(buildApiUrl(`/clients/${clientId}/status`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientStatus: 'approved' }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Client reactivated:', data);
        // Refresh clients list
        const currentBusiness = authConfig.getCurrentBusiness(user);
        if (currentBusiness) {
          await fetchClients(currentBusiness.businessId._id);
        }
        alert('Client account reactivated successfully.');
      } else {
        const errorData = await response.json();
        console.error('Error reactivating client:', errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error reactivating client:', err);
      alert('Network error. Please try again.');
    }
  };

  // Load user data and business context
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      const currentUser = authConfig.getCurrentUser();
      console.log('Current user:', currentUser); // Debug log
      setUser(currentUser);
      
      if (currentUser) {
        // Validate user role for business dashboard access
        const userRole = authConfig.getUserRole(currentUser);
        if (userRole !== 'admin' && userRole !== 'instructor' && userRole !== 'super-admin') {
          setError('Access denied. This dashboard is only available for business administrators and instructors.');
          setLoading(false);
          return;
        }

        const currentBusiness = authConfig.getCurrentBusiness(currentUser);
        console.log('Current business:', currentBusiness); // Debug log
        
        if (currentBusiness) {
          // Check if business is activated (only for non-super-admin users)
          if (userRole !== 'super-admin' && currentBusiness.businessId?.status !== 'active') {
            // Redirect to pending approval page
            window.location.href = '/business/pending-approval';
            return;
          }
          const businessId = currentBusiness.businessId._id;
          console.log('Business ID:', businessId); // Debug log
          console.log('Business data from login:', currentBusiness.businessId); // Debug log
          
          // Update business info
          setBusinessInfo({
            name: currentBusiness.businessId.name,
            email: currentBusiness.businessId.email,
            type: currentBusiness.businessId.businessType,
            address: currentBusiness.businessId.address || '',
            businessCode: currentBusiness.businessId.businessCode
          });

          // Fetch dashboard data
          await fetchBusinessDashboardData(businessId);
        } else {
          console.log('No current business found'); // Debug log
          setError('No business information found. Please contact support.');
        }
      } else {
        console.log('No current user found'); // Debug log
        setError('Please log in to access the dashboard.');
      }
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  // Fetch clients when clients tab is active
  useEffect(() => {
    if (activeTab === 'clients' && user) {
      const currentBusiness = authConfig.getCurrentBusiness(user);
      if (currentBusiness) {
        const businessId = currentBusiness.businessId._id;
        fetchClients(businessId);
        fetchPendingClients(businessId);
        fetchPendingCatchUpApprovals(businessId);
      }
    }
  }, [activeTab, user]);

  // Fetch catch-up requests when catch-up tab is active
  useEffect(() => {
    if (activeTab === 'catchup' && user) {
      const currentBusiness = authConfig.getCurrentBusiness(user);
      if (currentBusiness) {
        const businessId = currentBusiness.businessId._id;
        fetchCatchUpRequests(businessId);
      }
    }
  }, [activeTab, user]);


  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Navbar 
          showNavigation={false}
          showAuth={false}
          showLogoText={true}
          userInfo={{
            welcome: user?.firstName ? `Welcome back, ${user.firstName}!` : "Welcome back!",
            role: `${businessInfo.name} Admin`
          }}
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Dashboard Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Business Dashboard
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                  Manage your business, clients, and classes
                </p>
              </div>
              {user && (
                <div className="w-full lg:w-auto">
                  <BusinessSelector 
                    user={user} 
                    onBusinessChange={async (newBusiness) => {
                      if (newBusiness) {
                        const businessId = newBusiness.businessId._id;
                        
                        // Update business info
                        setBusinessInfo({
                          name: newBusiness.businessId.name,
                          email: newBusiness.businessId.email,
                          type: newBusiness.businessId.businessType,
                          address: newBusiness.businessId.address || '',
                          businessCode: newBusiness.businessId.businessCode
                        });

                        // Fetch new dashboard data
                        await fetchBusinessDashboardData(businessId);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 sm:mb-8">
            <nav className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-8 border-b border-slate-200 dark:border-slate-700">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'clients', label: 'Clients', showBadge: pendingClients.length > 0, badgeCount: pendingClients.length },
                { id: 'catchup', label: 'Catch-Up', showBadge: catchUpRequests.filter(c => c.catchUpApprovalStatus === 'pending').length > 0, badgeCount: catchUpRequests.filter(c => c.catchUpApprovalStatus === 'pending').length },
                { id: 'classes', label: 'Classes' },
                { id: 'schedules', label: 'Sessions' },
                { id: 'employees', label: 'Employees' },
                { id: 'reports', label: 'Reports' },
                { id: 'settings', label: 'Settings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap relative ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                  {tab.showBadge && (
                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {tab.badgeCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-slate-600 dark:text-slate-300">Loading dashboard data...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4">
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                ) : (
                  <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Clients</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{dashboardData.stats.totalClients}</p>
                          </div>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Employees</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{dashboardData.stats.totalInstructors}</p>
                          </div>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Classes</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{dashboardData.stats.totalClasses}</p>
                          </div>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activities</h3>
                      <div className="space-y-3">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.type === 'registration' ? 'bg-green-500' :
                              activity.type === 'cancellation' ? 'bg-red-500' :
                              activity.type === 'booking' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-900 dark:text-slate-100">{activity.message}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Client Management</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base w-full sm:w-auto">
                    Add New Client
                  </button>
                </div>

                {/* Pending Client Requests */}
                {pendingClients.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-yellow-50 dark:bg-yellow-900/20">
                      <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending Client Requests ({pendingClients.length})
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">These clients are waiting for your approval</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">
                              Email
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                              Phone
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                              Requested
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                          {pendingClients.map((pendingClient) => (
                            <tr key={pendingClient._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                              <td className="px-4 sm:px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                    <span className="text-yellow-600 dark:text-yellow-400 font-medium text-xs sm:text-sm">
                                      {pendingClient.userId?.firstName?.charAt(0) || 'C'}
                                    </span>
                                  </div>
                                  <div className="ml-3 sm:ml-4">
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                      {pendingClient.userId?.firstName} {pendingClient.userId?.lastName}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                                      {pendingClient.userId?.email || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {pendingClient.userId?.email || 'N/A'}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {pendingClient.userId?.phone || 'N/A'}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {pendingClient.createdAt ? new Date(pendingClient.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button 
                                    onClick={() => {
                                      const currentBusiness = authConfig.getCurrentBusiness(user);
                                      if (currentBusiness) {
                                        approveClientRequest(currentBusiness.businessId._id, pendingClient.userId._id);
                                      }
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const currentBusiness = authConfig.getCurrentBusiness(user);
                                      if (currentBusiness) {
                                        rejectClientRequest(currentBusiness.businessId._id, pendingClient.userId._id);
                                      }
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Pending Catch-Up Approvals */}
                {pendingCatchUpApprovals.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/20">
                      <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending Catch-Up Access Requests ({pendingCatchUpApprovals.length})
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Clients who have cancelled and are requesting catch-up lesson access</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Client
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">
                              Email
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                              Cancellations
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                          {pendingCatchUpApprovals.map((client) => (
                            <tr key={client._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                              <td className="px-4 sm:px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm">
                                      {client.firstName?.charAt(0) || 'C'}
                                    </span>
                                  </div>
                                  <div className="ml-3 sm:ml-4">
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                      {client.firstName} {client.lastName}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                                      {client.userId?.email || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {client.userId?.email || 'N/A'}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {client.cancellationCount || 0}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button 
                                    onClick={() => approveCatchUpAccess(client._id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => rejectCatchUpAccess(client._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Regular Clients */}
                {clientsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-slate-600 dark:text-slate-300">Loading clients...</span>
                  </div>
                ) : clientsError ? (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4">
                    <p className="text-red-700 dark:text-red-300">{clientsError}</p>
                  </div>
                ) : clients.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">No clients found</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Clients will appear here once they register with your business code</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                      <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                        Clients ({clients.length})
                      </h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">
                              Email
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                              Phone
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                              Joined Date
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden xl:table-cell">
                              Cancellations
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
Status
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                          {clients.map((client) => (
                            <tr key={client._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                              <td className="px-4 sm:px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm">
                                      {client.firstName?.charAt(0) || 'C'}
                                    </span>
                                  </div>
                                  <div className="ml-3 sm:ml-4">
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                      {client.firstName} {client.lastName}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                                      {client.userId?.email || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {client.userId?.email || 'N/A'}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {client.phoneNumber || 'N/A'}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {client.joinedDate ? new Date(client.joinedDate).toLocaleDateString() : 'N/A'}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {client.cancellationCount || 0}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  client.userId?.clientStatus === 'approved' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : client.userId?.clientStatus === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : client.userId?.clientStatus === 'suspended'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
                                }`}>
                                  {client.userId?.clientStatus === 'approved' ? 'Approved' :
                                   client.userId?.clientStatus === 'pending' ? 'Pending' :
                                   client.userId?.clientStatus === 'suspended' ? 'Suspended' :
                                   'Unknown'}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
                                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm sm:mr-3">
                                    View
                                  </button>
                                  {client.userId?.clientStatus === 'approved' && (
                                    <button 
                                      onClick={() => {
                                        if (confirm('Are you sure you want to suspend this client account?')) {
                                          suspendClient(client.userId._id);
                                        }
                                      }}
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs sm:text-sm"
                                    >
                                      Suspend
                                    </button>
                                  )}
                                  {client.userId?.clientStatus === 'suspended' && (
                                    <button 
                                      onClick={() => {
                                        if (confirm('Are you sure you want to reactivate this client account?')) {
                                          reactivateClient(client.userId._id);
                                        }
                                      }}
                                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm"
                                    >
                                      Reactivate
                                    </button>
                                  )}
                                </div>
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

            {activeTab === 'catchup' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Catch-Up Management</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      Review and manage catch-up requests from clients who have cancelled lessons
                    </p>
                  </div>
                </div>

                {catchUpRequestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-slate-600 dark:text-slate-300">Loading catch-up requests...</span>
                  </div>
                ) : catchUpRequestsError ? (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4">
                    <p className="text-red-700 dark:text-red-300">{catchUpRequestsError}</p>
                  </div>
                ) : catchUpRequests.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">No catch-up requests found</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Clients who cancel lessons will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pending Requests */}
                    {catchUpRequests.filter(c => c.catchUpApprovalStatus === 'pending').length > 0 && (
                      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-yellow-50 dark:bg-yellow-900/20">
                          <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center">
                            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending Approval ({catchUpRequests.filter(c => c.catchUpApprovalStatus === 'pending').length})
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Clients waiting for catch-up access approval</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[600px]">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                              <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                  Client
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">
                                  Email
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                                  Cancellations
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                              {catchUpRequests.filter(c => c.catchUpApprovalStatus === 'pending').map((client) => (
                                <tr key={client._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                                  <td className="px-4 sm:px-6 py-4">
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                        <span className="text-yellow-600 dark:text-yellow-400 font-medium text-xs sm:text-sm">
                                          {client.firstName?.charAt(0) || 'C'}
                                        </span>
                                      </div>
                                      <div className="ml-3 sm:ml-4">
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                          {client.firstName} {client.lastName}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                                          {client.email || 'N/A'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                    <div className="text-sm text-slate-900 dark:text-slate-100">
                                      {client.email || 'N/A'}
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                    <div className="text-sm text-slate-900 dark:text-slate-100">
                                      {client.cancellationCount || 0}
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <button 
                                        onClick={() => {
                                          if (confirm(`Approve catch-up access for ${client.firstName} ${client.lastName}?`)) {
                                            approveCatchUpAccess(client._id);
                                          }
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                      >
                                        Approve
                                      </button>
                                      <button 
                                        onClick={() => {
                                          if (confirm(`Reject catch-up access for ${client.firstName} ${client.lastName}?`)) {
                                            rejectCatchUpAccess(client._id);
                                          }
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* All Clients with Cancellations */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                        <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                          All Clients with Cancelled Lessons ({catchUpRequests.length})
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">View all clients who have cancelled lessons and their catch-up status</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                          <thead className="bg-slate-50 dark:bg-slate-700">
                            <tr>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                Client
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">
                                Email
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                                Cancellations
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                                Cancelled Lessons
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {catchUpRequests.map((client) => (
                              <tr key={client._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                                <td className="px-4 sm:px-6 py-4">
                                  <div className="flex items-center">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                                      client.catchUpApprovalStatus === 'pending' 
                                        ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                                        : client.catchUpApprovalStatus === 'approved'
                                        ? 'bg-green-100 dark:bg-green-900/30'
                                        : client.catchUpApprovalStatus === 'rejected'
                                        ? 'bg-red-100 dark:bg-red-900/30'
                                        : 'bg-blue-100 dark:bg-blue-900/30'
                                    }`}>
                                      <span className={`font-medium text-xs sm:text-sm ${
                                        client.catchUpApprovalStatus === 'pending' 
                                          ? 'text-yellow-600 dark:text-yellow-400' 
                                          : client.catchUpApprovalStatus === 'approved'
                                          ? 'text-green-600 dark:text-green-400'
                                          : client.catchUpApprovalStatus === 'rejected'
                                          ? 'text-red-600 dark:text-red-400'
                                          : 'text-blue-600 dark:text-blue-400'
                                      }`}>
                                        {client.firstName?.charAt(0) || 'C'}
                                      </span>
                                    </div>
                                    <div className="ml-3 sm:ml-4">
                                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {client.firstName} {client.lastName}
                                      </div>
                                      <div className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                                        {client.email || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                  <div className="text-sm text-slate-900 dark:text-slate-100">
                                    {client.email || 'N/A'}
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                  <div className="text-sm text-slate-900 dark:text-slate-100">
                                    {client.cancellationCount || 0}
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                                  <div className="text-sm text-slate-900 dark:text-slate-100">
                                    {client.cancelledSessions && client.cancelledSessions.length > 0 ? (
                                      <div className="space-y-2">
                                        {client.cancelledSessions.map((session, idx) => (
                                          <div key={idx} className="text-xs border-l-2 pl-2 py-1 border-slate-200 dark:border-slate-700">
                                            <div className="font-medium">{session.classTitle || 'Unknown Class'}</div>
                                            {session.date && (
                                              <div className="text-slate-500 dark:text-slate-400">
                                                {new Date(session.date).toLocaleDateString()} {session.startTime && `at ${session.startTime}`}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-slate-400 dark:text-slate-500">No details available</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4">
                                  <div className="space-y-2">
                                    {client.cancelledSessions && client.cancelledSessions.length > 0 ? (
                                      client.cancelledSessions.map((session, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            session.catchUpApprovalStatus === 'pending' 
                                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                              : session.catchUpApprovalStatus === 'approved'
                                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                              : session.catchUpApprovalStatus === 'rejected'
                                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                              : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
                                          }`}>
                                            {session.catchUpApprovalStatus === 'pending' ? 'Pending' :
                                             session.catchUpApprovalStatus === 'approved' ? 'Approved' :
                                             session.catchUpApprovalStatus === 'rejected' ? 'Rejected' :
                                             'Unknown'}
                                          </span>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-xs text-slate-400 dark:text-slate-500">N/A</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-sm font-medium">
                                  <div className="space-y-2">
                                    {client.cancelledSessions && client.cancelledSessions.length > 0 ? (
                                      client.cancelledSessions.map((session, idx) => (
                                        <div key={idx} className="flex flex-col gap-1">
                                          {session.catchUpApprovalStatus === 'pending' ? (
                                            <div className="flex gap-1">
                                              <button 
                                                onClick={() => {
                                                  if (confirm(`Approve catch-up access for ${session.classTitle || 'this session'}?`)) {
                                                    approveCatchUpSession(session.notificationId);
                                                  }
                                                }}
                                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200"
                                              >
                                                Approve
                                              </button>
                                              <button 
                                                onClick={() => {
                                                  if (confirm(`Reject catch-up access for ${session.classTitle || 'this session'}?`)) {
                                                    rejectCatchUpSession(session.notificationId);
                                                  }
                                                }}
                                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200"
                                              >
                                                Reject
                                              </button>
                                            </div>
                                          ) : session.catchUpApprovalStatus === 'approved' ? (
                                            <span className="text-xs text-green-600 dark:text-green-400">
                                              Approved {session.catchUpApprovedAt ? new Date(session.catchUpApprovedAt).toLocaleDateString() : ''}
                                            </span>
                                          ) : session.catchUpApprovalStatus === 'rejected' ? (
                                            <span className="text-xs text-red-600 dark:text-red-400">
                                              Rejected {session.catchUpApprovedAt ? new Date(session.catchUpApprovedAt).toLocaleDateString() : ''}
                                            </span>
                                          ) : (
                                            <span className="text-xs text-slate-400 dark:text-slate-500">N/A</span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-xs text-slate-400 dark:text-slate-500">No actions</span>
                                    )}
                                  </div>
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
            )}

            {activeTab === 'classes' && (
              <ClassManagement />
            )}

            {activeTab === 'schedules' && (
              <SessionManagement />
            )}

        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Employee Management
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Manage employee roles and permissions. Employees register using your business code.
              </p>
            </div>
            <EmployeeManagement />
          </div>
        )}

            {activeTab === 'reports' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Reports & Analytics</h3>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">Reports and analytics coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Business Settings</h3>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Business Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                          <p className="text-slate-900 dark:text-slate-100">{businessInfo.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Type</label>
                          <p className="text-slate-900 dark:text-slate-100">{businessInfo.type}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                          <p className="text-slate-900 dark:text-slate-100">{businessInfo.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                          <p className="text-slate-900 dark:text-slate-100">{businessInfo.address}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Code</label>
                          <div className="flex items-center space-x-2">
                            <p className="text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded">
                              {businessInfo.businessCode}
                            </p>
                            <button 
                              onClick={() => navigator.clipboard.writeText(businessInfo.businessCode)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                              title="Copy business code"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Share this code with clients for easy registration
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Account Settings</h4>
                      <div className="space-y-3">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                          Edit Business Info
                        </button>
                        <button 
                          onClick={() => setShowPasswordModal(true)}
                          className="w-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 font-medium"
                        >
                          Change Password
                        </button>
                        <button className="w-full border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 font-medium">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
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
