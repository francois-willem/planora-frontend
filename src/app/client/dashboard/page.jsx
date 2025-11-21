// src/app/client/dashboard.tsx
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeProvider } from '../../../../lib/ThemeContext';
import Navbar from '../../../../components/Navbar';
import BusinessSelector from '../../../../components/BusinessSelector';
import PasswordChangeModal from '../../../../components/PasswordChangeModal';
import ClientProfileUpdate from '../../../../components/ClientProfileUpdate';
import MemberManagement from '../../../../components/MemberManagement';
import { authConfig } from '../../../../lib/auth';
import { buildApiUrl, API_ENDPOINTS } from '../../../../lib/config';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [availableCatchUps, setAvailableCatchUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    businessName: '',
    clientId: '',
    cancellationCount: 0,
    hasCancelledBefore: false,
    catchUpApprovalStatus: null,
    catchUpCredits: 0
  });

  // Load user data and business context
  useEffect(() => {
    const currentUser = authConfig.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      // Validate user role for client dashboard access
      const userRole = authConfig.getUserRole(currentUser);
      if (userRole !== 'client') {
        setError('Access denied. This dashboard is only available for client accounts.');
        setLoading(false);
        return;
      }

      const currentBusiness = authConfig.getCurrentBusiness(currentUser);
      if (currentBusiness) {
        // Check if business is active
        if (currentBusiness.businessId?.status !== 'active') {
          window.location.href = '/client/pending-business-activation';
          return;
        }
        
        // Check if client is approved
        if (currentUser.clientStatus === 'pending') {
          window.location.href = '/client/pending-approval';
          return;
        }
        
        setUserInfo(prev => ({
          ...prev,
          businessName: currentBusiness.businessId.name,
          email: currentUser.email
        }));
      }
    }
  }, []);

  // Load real data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Loading dashboard data for user:', user);
        const response = await authConfig.makeAuthenticatedRequest(
          buildApiUrl(API_ENDPOINTS.CLIENT_DASHBOARD)
        );
        
        console.log('Dashboard API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Dashboard API data:', data);
          console.log('Upcoming classes:', data.data?.upcomingClasses);
          console.log('Available catch-ups:', data.data?.availableCatchUps);
          
          if (data.success) {
            console.log('Client data from API:', data.data.client);
            // Update user info with real data
            setUserInfo({
              name: `${data.data.client.firstName} ${data.data.client.lastName}`,
              email: data.data.client.email,
              businessName: data.data.client.businessName,
              clientId: data.data.client._id || data.data.client.id,
              cancellationCount: data.data.client.cancellationCount || 0,
              hasCancelledBefore: data.data.client.hasCancelledBefore || false,
              catchUpApprovalStatus: data.data.client.catchUpApprovalStatus || null,
              catchUpCredits: data.data.client.catchUpCredits || 0
            });
            
            // Set real data
            setUpcomingClasses(data.data.upcomingClasses || []);
            setAvailableCatchUps(data.data.availableCatchUps || []);
          } else {
            console.error('API Error:', data.message);
          }
        } else {
          // Try to parse error as JSON, but handle HTML responses
          let errorData;
          try {
            const text = await response.text();
            errorData = JSON.parse(text);
          } catch (parseError) {
            errorData = { message: `Server error: ${response.status} ${response.statusText}` };
          }
          console.error('Failed to fetch dashboard data:', errorData);
          setError(errorData.message || 'Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    } else {
      console.log('No user found, skipping dashboard data load');
      setLoading(false);
    }
  }, [user]);

  const handleConfirmClass = (classId) => {
    setUpcomingClasses(prev => 
      prev.map(cls => 
        cls.id === classId 
          ? { ...cls, status: 'confirmed' }
          : cls
      )
    );
  };

  const handleCancelClass = async (classId, memberId = null) => {
    if (!confirm('Are you sure you want to cancel this class?')) return;

    try {
      // Use the member's clientId if provided, otherwise fall back to primary client
      const clientId = memberId || userInfo.clientId;
      
      console.log('UserInfo:', userInfo);
      console.log('ClientId:', clientId);
      console.log('MemberId:', memberId);
      
      if (!clientId) {
        setError('Client ID not found. Please refresh the page and try again.');
        return;
      }

      // Make the cancellation API call
      const response = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(`/sessions/${classId}/cancel`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clientId }),
        }
      );

      if (response.ok) {
        // Reload dashboard data to get updated information
        const dashboardResponse = await authConfig.makeAuthenticatedRequest(
          buildApiUrl(API_ENDPOINTS.CLIENT_DASHBOARD)
        );
        
        if (dashboardResponse.ok) {
          const data = await dashboardResponse.json();
          
          // Update user info with updated cancellation data
          setUserInfo(prev => ({
            ...prev,
            clientId: data.data.client._id,
            cancellationCount: data.data.client.cancellationCount || 0,
            hasCancelledBefore: data.data.client.hasCancelledBefore || false,
            catchUpApprovalStatus: data.data.client.catchUpApprovalStatus || null,
            catchUpCredits: data.data.client.catchUpCredits || 0
          }));
          
          // Update upcoming classes
          setUpcomingClasses(data.data.upcomingClasses || []);
          setAvailableCatchUps(data.data.availableCatchUps || []);
        }
        
        setError('');
        setSuccess('Class cancelled successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to cancel class');
      }
    } catch (error) {
      console.error('Error cancelling class:', error);
      setError('Failed to cancel class. Please try again.');
    }
  };

  const handleBookCatchUp = (catchUpId) => {
    const catchUp = availableCatchUps.find(c => c.id === catchUpId);
    if (catchUp) {
      // Add to upcoming classes
      setUpcomingClasses(prev => [...prev, {
        ...catchUp,
        status: 'pending',
        notes: null
      }]);
      
      // Remove from available catch-ups
      setAvailableCatchUps(prev => prev.filter(c => c.id !== catchUpId));
    }
  };

  const formatDate = (dateString) => {
    // If no date provided, return placeholder
    if (!dateString) {
      return 'Date TBD';
    }
    
    // Handle regular date strings (YYYY-MM-DD format)
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
      if (isNaN(date.getTime())) {
        return 'Date TBD';
      }
      
      // Format as "Monday, 15 January 2024"
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const day = date.getDate();
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      const year = date.getFullYear();
      
      return `${dayName}, ${day} ${monthName} ${year}`;
    }
    
    // Handle other date formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date TBD';
    }
    
    // Format as "Monday, 15 January 2024"
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    return `${dayName}, ${day} ${monthName} ${year}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading your dashboard...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Navbar 
          showNavigation={false}
          showAuth={false}
          showLogoText={true}
          userInfo={{
            welcome: `Welcome back, ${userInfo.name}!`,
            role: `${userInfo.businessName} Client`
          }}
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Dashboard Header */}
          <div className="mb-6 sm:mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Your Dashboard
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                  Manage your classes and catch up on missed lessons
                </p>
              </div>
              {user && (
                <div className="w-full lg:w-auto">
                  <BusinessSelector 
                    user={user} 
                    onBusinessChange={(newBusiness) => {
                      if (newBusiness) {
                        setUserInfo(prev => ({
                          ...prev,
                          businessName: newBusiness.businessId.name
                        }));
                      }
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Catch-up Credits Display */}
            {userInfo.catchUpCredits > 0 && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg p-4 sm:p-6 border border-blue-400 dark:border-blue-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/90 dark:text-white/80 text-sm font-medium">Catch-up Credits Available</p>
                    <p className="text-white text-2xl sm:text-3xl font-bold">{userInfo.catchUpCredits}</p>
                    <p className="text-white/80 dark:text-white/70 text-xs mt-1">
                      {userInfo.catchUpCredits === 1 
                        ? 'You have 1 credit to book a catch-up lesson' 
                        : `You have ${userInfo.catchUpCredits} credits to book catch-up lessons`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-800 dark:text-green-200 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-6 sm:mb-8">
            <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 border-b border-slate-200 dark:border-slate-700">
              {[
                { id: 'upcoming', label: 'Upcoming Classes', count: upcomingClasses.length },
                { id: 'catchup', label: 'Available Catch-ups', count: availableCatchUps.length },
                { id: 'members', label: 'Members', count: null },
                { id: 'profile', label: 'Profile', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center justify-center sm:justify-start ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`ml-2 py-1 px-2 rounded-full text-xs flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Upcoming Classes
                </h3>
                {upcomingClasses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">No upcoming classes scheduled</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {upcomingClasses.map((classItem, index) => (
                      <div key={`${classItem.id}-${classItem.memberId || index}`} className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {classItem.title}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                              <p className="text-slate-600 dark:text-slate-300">
                                with {classItem.instructor}
                              </p>
                              {classItem.memberName && (
                                <span className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {classItem.memberName}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium self-start sm:self-auto ${getStatusColor(classItem.status)}`}>
                            {classItem.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</p>
                            <p className="text-slate-900 dark:text-slate-100 text-base font-semibold">{formatDate(classItem.date)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</p>
                            <p className="text-slate-900 dark:text-slate-100 text-base">
                              {classItem.startTime && classItem.endTime 
                                ? `${classItem.startTime} - ${classItem.endTime}` 
                                : classItem.time 
                                  ? `${classItem.time}${classItem.duration ? ` (${classItem.duration})` : ''}`
                                  : 'Time TBD'
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instructor</p>
                            <p className="text-slate-900 dark:text-slate-100 text-base">{classItem.instructor}</p>
                          </div>
                        </div>

                        {classItem.notes && (
                          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 sm:p-4 mb-4">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Instructor Note:</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{classItem.notes}</p>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          {classItem.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleConfirmClass(classItem.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 sm:py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleCancelClass(classItem.id, classItem.memberId)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 sm:py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {classItem.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelClass(classItem.id, classItem.memberId)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 sm:py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
                            >
                              Cancel Class
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'catchup' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Available Catch-up Lessons
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      These are classes that became available due to cancellations. Book them to make up for missed lessons.
                    </p>
                  </div>
                  {userInfo.catchUpCredits > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                            {userInfo.catchUpCredits} Catch-up {userInfo.catchUpCredits === 1 ? 'Credit' : 'Credits'}
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            You can book catch-up lessons
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {!userInfo.hasCancelledBefore ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Catch-up Access Required</h4>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      Catch-up lessons are only available to clients who have previously cancelled a session.
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      Once you cancel a session, you'll be able to book catch-up lessons when they become available.
                    </p>
                  </div>
                ) : userInfo.catchUpApprovalStatus === 'pending' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Catch-up Access Pending Approval</h4>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      Your catch-up access request is pending approval by the business administrator.
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      Once approved, you'll be able to book catch-up lessons when they become available.
                    </p>
                  </div>
                ) : userInfo.catchUpApprovalStatus === 'rejected' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Catch-up Access Rejected</h4>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      Your catch-up access request has been rejected.
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      Please contact the business administrator for more information.
                    </p>
                  </div>
                ) : availableCatchUps.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">No catch-up lessons available at the moment</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {availableCatchUps.map((catchUp) => (
                      <div key={catchUp.id} className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {catchUp.title}
                            </h4>
                            <p className="text-slate-600 dark:text-slate-300">
                              with {catchUp.instructor}
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 self-start sm:self-auto">
                            Available
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</p>
                            <p className="text-slate-900 dark:text-slate-100 text-base font-semibold">{formatDate(catchUp.date)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</p>
                            <p className="text-slate-900 dark:text-slate-100 text-base">
                              {catchUp.startTime && catchUp.endTime 
                                ? `${catchUp.startTime} - ${catchUp.endTime}` 
                                : catchUp.time 
                                  ? `${catchUp.time}${catchUp.duration ? ` (${catchUp.duration})` : ''}`
                                  : 'Time TBD'
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Available Because</p>
                            <p className="text-slate-900 dark:text-slate-100 text-base">{catchUp.reason}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBookCatchUp(catchUp.id)}
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
                        >
                          Book This Class
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-4">
                <MemberManagement />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Your Profile
                </h3>
                <ClientProfileUpdate 
                  userInfo={userInfo} 
                  onUpdate={(updatedInfo) => setUserInfo(updatedInfo)}
                />
                
                {/* Cancellation Information */}
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Session Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cancellations</label>
                      <p className="text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {userInfo.cancellationCount || 0} session{userInfo.cancellationCount !== 1 ? 's' : ''} cancelled
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Catch-up Credits</label>
                      <p className="text-slate-900 dark:text-slate-100 text-sm sm:text-base font-semibold">
                        {userInfo.catchUpCredits || 0} {userInfo.catchUpCredits === 1 ? 'credit' : 'credits'} available
                      </p>
                      {userInfo.catchUpCredits > 0 && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          ✓ You can book catch-up lessons
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Catch-up Access</label>
                      <p className="text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {userInfo.catchUpApprovalStatus === 'approved' 
                          ? 'Approved ✓' 
                          : userInfo.catchUpApprovalStatus === 'pending'
                          ? 'Pending Approval...'
                          : userInfo.catchUpApprovalStatus === 'rejected'
                          ? 'Rejected ✗'
                          : userInfo.hasCancelledBefore
                          ? 'Requires Approval'
                          : 'Not available (no previous cancellations)'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-3 sm:py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      Change Password
                    </button>
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
