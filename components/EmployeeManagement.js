'use client'
import { useState, useEffect } from 'react';
import { authConfig } from '../lib/auth';
import { buildApiUrl, API_ENDPOINTS } from '../lib/config';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingEmployee, setRejectingEmployee] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      
      // Load approved employees
      const employeesResponse = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(API_ENDPOINTS.EMPLOYEES)
      );
      
      // Load pending employees
      const pendingResponse = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(`${API_ENDPOINTS.EMPLOYEES}/pending`)
      );
      
      if (employeesResponse.ok) {
        const data = await employeesResponse.json();
        setEmployees(data.data || []);
      }
      
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingEmployees(pendingData.data || []);
      }
      
      if (!employeesResponse.ok && !pendingResponse.ok) {
        setError('Failed to load employees');
      }
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };


  const handleApprove = async (employeeId) => {
    try {
      const response = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(`${API_ENDPOINTS.EMPLOYEES}/${employeeId}/approve`),
        {
          method: 'PUT',
        }
      );

      if (response.ok) {
        // Reload both lists to ensure data consistency
        await loadEmployees();
      } else {
        setError('Failed to approve employee');
      }
    } catch (err) {
      setError('Failed to approve employee');
    }
  };

  const handleReject = async (employeeId, reason) => {
    try {
      const response = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(`${API_ENDPOINTS.EMPLOYEES}/${employeeId}/reject`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rejectionReason: reason }),
        }
      );

      if (response.ok) {
        // Reload both lists to ensure data consistency
        await loadEmployees();
        setShowRejectModal(false);
        setRejectReason('');
        setRejectingEmployee(null);
      } else {
        setError('Failed to reject employee');
      }
    } catch (err) {
      setError('Failed to reject employee');
    }
  };

  const handleDeactivate = async (employeeId) => {
    if (!confirm('Are you sure you want to deactivate this employee?')) {
      return;
    }

    try {
      const response = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(`${API_ENDPOINTS.EMPLOYEES}/${employeeId}`),
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        // Remove the employee from the local state
        setEmployees(prev => prev.filter(emp => emp._id !== employeeId));
      } else {
        setError('Failed to deactivate employee');
      }
    } catch (err) {
      setError('Failed to deactivate employee');
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Employee Management
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Manage employee roles and permissions
          </p>
        </div>

        <div className="p-6">
          {/* Pending Employees Section */}
          {pendingEmployees.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Pending Approval ({pendingEmployees.length})
                </h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  Awaiting Review
                </span>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Action Required:</strong> These employees have registered and are waiting for your approval to access their dashboard.
                </p>
              </div>

              <div className="space-y-3">
                {pendingEmployees.map((employee) => (
                  <div key={employee._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {employee.userId?.email} • {employee.phone}
                          </div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">
                            Registered: {new Date(employee.hireDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(employee._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setRejectingEmployee(employee);
                            setShowRejectModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Employees Section */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Active Employees ({employees.length})
            </h4>
            
            {employees.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-400">No active employees</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                  {pendingEmployees.length > 0 ? 'Approve pending employees to see them here' : 'Employees will appear here after they register using your business code'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Hire Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {employees.map((employee) => (<tr key={employee._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {employee.userId?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        {employee.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeactivate(employee._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && rejectingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Reject Employee Application
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Rejecting: <strong>{rejectingEmployee.firstName} {rejectingEmployee.lastName}</strong>
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {rejectingEmployee.userId?.email}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Reason for rejection (optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason for rejection (this will be shown to the employee)..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-100"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setRejectingEmployee(null);
                }}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingEmployee._id, rejectReason)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
