// src/app/employee/dashboard/page.jsx
'use client'
import { useState, useEffect } from 'react';
import { ThemeProvider } from '../../../../lib/ThemeContext';
import Navbar from '../../../../components/Navbar';
import PasswordChangeModal from '../../../../components/PasswordChangeModal';
import { authConfig } from '../../../../lib/auth';
import { buildApiUrl, API_ENDPOINTS } from '../../../../lib/config';

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState('classes');
  const [user, setUser] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: ''
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Load user data and business context
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      const currentUser = authConfig.getCurrentUser();
      console.log('Current user:', currentUser);
      setUser(currentUser);
      
      if (currentUser) {
        // Validate user role for employee dashboard access
        const userRole = authConfig.getUserRole(currentUser);
        if (userRole !== 'employee') {
          setError('Access denied. This dashboard is only available for employee accounts.');
          setLoading(false);
          return;
        }

        const currentBusiness = authConfig.getCurrentBusiness(currentUser);
        console.log('Current business:', currentBusiness);
        
        if (currentBusiness) {
          // Check if business is active
          if (currentBusiness.businessId?.status !== 'active') {
            setError('Your business account is not active. Please contact your administrator.');
            setLoading(false);
            return;
          }

          // Update employee info
          setEmployeeInfo(prev => ({
            ...prev,
            email: currentUser.email,
            businessName: currentBusiness.businessId.name
          }));

          // Fetch employee profile data
          await fetchEmployeeProfile(currentUser._id);
          
          // Fetch classes data
          await fetchEmployeeClasses(currentBusiness.businessId._id);
        } else {
          setError('No business association found. Please contact support.');
        }
      } else {
        setError('Please log in to access your dashboard.');
      }
      
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  // Fetch employee profile data
  const fetchEmployeeProfile = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(buildApiUrl(`/employees/profile/${userId}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data; // Backend returns data wrapped in a 'data' property
        setEmployeeInfo(prev => ({
          ...prev,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || ''
        }));
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch employee profile:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching employee profile:', error);
    }
  };

  // Fetch employee classes
  const fetchEmployeeClasses = async (businessId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(buildApiUrl(`/sessions/employee/${businessId}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data.data || []);
      } else {
        console.error('Failed to fetch employee classes');
        setClasses([]);
      }
    } catch (error) {
      console.error('Error fetching employee classes:', error);
      setClasses([]);
    }
  };

  // Update employee profile
  const updateEmployeeProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(buildApiUrl(`/employees/profile/${user._id}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const data = await response.json();
        setEmployeeInfo(prev => ({
          ...prev,
          ...data
        }));
        return { success: true, message: 'Profile updated successfully!' };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Failed to update profile' };
      }
    } catch (error) {
      console.error('Error updating employee profile:', error);
      return { success: false, message: 'Error updating profile' };
    }
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <Navbar showAuth={true} />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300">Loading your dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <Navbar showAuth={true} />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="text-center">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Access Error
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Navbar showAuth={true} />
        
        <main className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Employee Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Welcome back, {employeeInfo.firstName}! Manage your classes and profile.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('classes')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'classes'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  My Classes
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  Edit Profile
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              {/* Classes Tab */}
              {activeTab === 'classes' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      My Classes
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      View your assigned classes and client information.
                    </p>
                  </div>

                  {classes.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-slate-400 text-6xl mb-4">📅</div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                        No Classes Assigned
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        You don't have any classes assigned yet. Contact your administrator.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Class Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Client Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Day & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                          {classes.map((classItem) => (
                            <tr key={classItem._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {classItem.className || 'Swimming Lesson'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {classItem.clientName || 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                  {classItem.dayOfWeek ? classItem.dayOfWeek.charAt(0).toUpperCase() + classItem.dayOfWeek.slice(1) : 'Not set'}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {classItem.startTime && classItem.endTime ? `${classItem.startTime} - ${classItem.endTime}` : 'No time set'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  classItem.status === 'scheduled' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : classItem.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {classItem.status || 'scheduled'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Edit Profile
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      Update your personal information and change your password.
                    </p>
                  </div>

                  <div className="max-w-2xl">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const updatedData = {
                        firstName: formData.get('firstName'),
                        lastName: formData.get('lastName'),
                        phone: formData.get('phone')
                      };
                      
                      const result = await updateEmployeeProfile(updatedData);
                      if (result.success) {
                        alert('Profile updated successfully!');
                      } else {
                        alert('Error: ' + result.message);
                      }
                    }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            defaultValue={employeeInfo.firstName}
                            required
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            defaultValue={employeeInfo.lastName}
                            required
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={employeeInfo.email}
                          disabled
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-400"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Email cannot be changed. Contact your administrator if needed.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          defaultValue={employeeInfo.phone}
                          required
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Business
                        </label>
                        <input
                          type="text"
                          value={employeeInfo.businessName}
                          disabled
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-400"
                        />
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                        >
                          Update Profile
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setShowPasswordModal(true)}
                          className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                        >
                          Change Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <PasswordChangeModal
            onClose={() => setShowPasswordModal(false)}
            onSuccess={() => {
              setShowPasswordModal(false);
              alert('Password changed successfully!');
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
