// components/SessionManagement.js
'use client'
import { useState, useEffect } from 'react';
import { authConfig } from '../lib/auth';
import { buildApiUrl, API_ENDPOINTS } from '../lib/config';

export default function SessionManagement() {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [formData, setFormData] = useState({
    classId: '',
    instructorId: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    isRecurring: false,
    recurringPattern: {
      frequency: 'weekly',
      endDate: ''
    },
    notes: ''
  });

  // Load sessions, classes, and employees
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load sessions
      const sessionsResponse = await authConfig.makeAuthenticatedRequest(
        buildApiUrl('/sessions')
      );
      
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        console.log('Sessions data received:', sessionsData);
        setSessions(sessionsData.data || []);
      }

      // Load classes
      const classesResponse = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(API_ENDPOINTS.CLASSES)
      );
      
      if (classesResponse.ok) {
        const classesData = await classesResponse.json();
        setClasses(classesData.data || []);
      }

      // Load employees
      const employeesResponse = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(API_ENDPOINTS.EMPLOYEES)
      );
      
      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData.data || []);
      }

      // Load clients
      const clientsResponse = await authConfig.makeAuthenticatedRequest(
        buildApiUrl('/clients')
      );
      
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        setClients(clientsData.data || []);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const isEditing = editingSession !== null;
      const url = isEditing 
        ? buildApiUrl(`/sessions/${editingSession._id}`)
        : buildApiUrl('/sessions');
      
      const response = await authConfig.makeAuthenticatedRequest(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadData(); // Reload data
        setShowCreateModal(false);
        setEditingSession(null);
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save session');
      }
    } catch (err) {
      setError('Failed to save session');
    }
  };

  const handleEdit = (sessionItem) => {
    setEditingSession(sessionItem);
    setFormData({
      classId: sessionItem.classId._id,
      instructorId: sessionItem.instructorId._id,
      dayOfWeek: sessionItem.dayOfWeek || '',
      startTime: sessionItem.startTime,
      endTime: sessionItem.endTime,
      isRecurring: sessionItem.isRecurring || false,
      recurringPattern: {
        frequency: sessionItem.recurringPattern?.frequency || 'weekly',
        endDate: sessionItem.recurringPattern?.endDate ? new Date(sessionItem.recurringPattern.endDate).toISOString().split('T')[0] : ''
      },
      notes: sessionItem.notes || ''
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const response = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(`/sessions/${sessionId}`),
        { method: 'DELETE' }
      );

      if (response.ok) {
        await loadData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete session');
      }
    } catch (err) {
      setError('Failed to delete session');
    }
  };

  const handleEnrollClient = (session) => {
    setSelectedSession(session);
    setSelectedClient('');
    setShowEnrollModal(true);
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient || !selectedSession || enrollLoading) return;

    setEnrollLoading(true);
    setError('');

    try {
      const response = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(`/sessions/${selectedSession._id}/enroll`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clientId: selectedClient }),
        }
      );

      if (response.ok) {
        await loadData(); // Reload data to show updated enrollments
        setShowEnrollModal(false);
        setSelectedSession(null);
        setSelectedClient('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to enroll client');
      }
    } catch (err) {
      setError('Failed to enroll client');
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleCancelEnrollment = async (sessionId, clientId) => {
    if (!confirm('Are you sure you want to cancel this enrollment?')) return;

    console.log('Canceling enrollment:', { sessionId, clientId });

    try {
      const response = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(`/sessions/${sessionId}/cancel`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clientId }),
        }
      );

      console.log('Cancel enrollment response:', response.status);

      if (response.ok) {
        await loadData(); // Reload data
      } else {
        const errorData = await response.json();
        console.error('Cancel enrollment error:', errorData);
        setError(errorData.message || 'Failed to cancel enrollment');
      }
    } catch (err) {
      console.error('Cancel enrollment exception:', err);
      setError('Failed to cancel enrollment');
    }
  };

  const resetForm = () => {
    setFormData({
      classId: '',
      instructorId: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      isRecurring: false,
      recurringPattern: {
        frequency: 'weekly',
        endDate: ''
      },
      notes: ''
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('recurringPattern.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        recurringPattern: {
          ...prev.recurringPattern,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Session Management
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Create and manage class sessions
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingSession(null);
            setShowCreateModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          Create New Session
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Schedules List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Enrolled Clients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {sessions.map((session) => (<tr key={session._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {session.classId?.title || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {session.instructorId ? 
                        `${session.instructorId.firstName} ${session.instructorId.lastName}` : 
                        'N/A'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {session.dayOfWeek ? session.dayOfWeek.charAt(0).toUpperCase() + session.dayOfWeek.slice(1) : 'Not set'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {session.startTime} - {session.endTime}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {session.enrolledClients && session.enrolledClients.length > 0 ? (
                        <div className="space-y-1">
                          {session.enrolledClients.map((enrollment, index) => {
                            console.log('Enrollment data:', enrollment);
                            return (
                            <div key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded">
                              <span className="text-xs">
                                {enrollment.clientId ? 
                                  `${enrollment.clientId.firstName} ${enrollment.clientId.lastName}` : 
                                  'Unknown Client'
                                }
                              </span>
                              <button
                                onClick={() => {
                                  const clientId = enrollment.clientId._id || enrollment.clientId;
                                  console.log('Removing client:', { sessionId: session._id, clientId, enrollment });
                                  handleCancelEnrollment(session._id, clientId);
                                }}
                                className="text-red-500 hover:text-red-700 text-xs ml-2"
                                title="Remove client"
                              >
                                ×
                              </button>
                            </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">No clients enrolled</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      session.status === 'scheduled' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : session.status === 'confirmed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-1">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(session)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(session._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                      <button
                        onClick={() => handleEnrollClient(session)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs"
                      >
                        + Add Client
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                {editingSession ? 'Edit Session' : 'Create New Session'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Class
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({...formData, classId: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select a class</option>
                    {classes.map((classItem) => (
                      <option key={classItem._id} value={classItem._id}>
                        {classItem.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Instructor
                  </label>
                  <select
                    value={formData.instructorId}
                    onChange={(e) => setFormData({...formData, instructorId: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select an instructor</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Day of Week
                  </label>
                  <select
                    name="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select a day</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Recurring Pattern */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isRecurring"
                      checked={formData.isRecurring}
                      onChange={handleChange}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      This is a recurring class
                    </span>
                  </label>
                </div>

                {formData.isRecurring && (
                  <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Frequency
                      </label>
                      <select
                        name="recurringPattern.frequency"
                        value={formData.recurringPattern.frequency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        End Date (optional)
                      </label>
                      <input
                        type="date"
                        name="recurringPattern.endDate"
                        value={formData.recurringPattern.endDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingSession(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    {editingSession ? 'Update Session' : 'Create Session'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Client Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Add Client to Session
              </h3>
              
              {selectedSession && (
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedSession.classId?.title || 'Class'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {selectedSession.dayOfWeek ? selectedSession.dayOfWeek.charAt(0).toUpperCase() + selectedSession.dayOfWeek.slice(1) : 'Not set'} • {selectedSession.startTime} - {selectedSession.endTime}
                  </p>
                </div>
              )}
              
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Select Client
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Choose a client</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.firstName} {client.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEnrollModal(false);
                      setSelectedSession(null);
                      setSelectedClient('');
                    }}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={enrollLoading}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      enrollLoading 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {enrollLoading ? 'Enrolling...' : 'Enroll Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
