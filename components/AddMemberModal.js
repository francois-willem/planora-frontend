// components/AddMemberModal.js
// Modal component for adding a new member to a client account

"use client"
import { useState, useEffect } from 'react';
import { authConfig } from '../lib/auth';
import { buildApiUrl, API_ENDPOINTS } from '../lib/config';

export default function AddMemberModal({ isOpen, onClose, onSuccess, editingMember = null }) {
  // Initialize form data with editing member data if provided
  const getInitialFormData = () => {
    if (editingMember) {
      // Format dateOfBirth for date input (YYYY-MM-DD)
      let formattedDateOfBirth = '';
      if (editingMember.dateOfBirth) {
        const date = new Date(editingMember.dateOfBirth);
        formattedDateOfBirth = date.toISOString().split('T')[0];
      }
      
      return {
        firstName: editingMember.firstName || '',
        lastName: editingMember.lastName || '',
        dateOfBirth: formattedDateOfBirth,
        phone: editingMember.phone || '',
        relationship: editingMember.relationship || 'child',
        emergencyContact: editingMember.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        medicalInfo: editingMember.medicalInfo || {
          allergies: '',
          medications: '',
          conditions: ''
        }
      };
    }
    
    return {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phone: '',
      relationship: 'child',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      medicalInfo: {
        allergies: '',
        medications: '',
        conditions: ''
      }
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when editingMember changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingMember) {
        // Format dateOfBirth for date input (YYYY-MM-DD)
        let formattedDateOfBirth = '';
        if (editingMember.dateOfBirth) {
          const date = new Date(editingMember.dateOfBirth);
          formattedDateOfBirth = date.toISOString().split('T')[0];
        }
        
        setFormData({
          firstName: editingMember.firstName || '',
          lastName: editingMember.lastName || '',
          dateOfBirth: formattedDateOfBirth,
          phone: editingMember.phone || '',
          relationship: editingMember.relationship || 'child',
          emergencyContact: editingMember.emergencyContact || {
            name: '',
            phone: '',
            relationship: ''
          },
          medicalInfo: editingMember.medicalInfo || {
            allergies: '',
            medications: '',
            conditions: ''
          }
        });
      } else {
        // Reset to empty form for adding new member
        setFormData({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          phone: '',
          relationship: 'child',
          emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
          },
          medicalInfo: {
            allergies: '',
            medications: '',
            conditions: ''
          }
        });
      }
      setError('');
    }
  }, [isOpen, editingMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else if (name.startsWith('medicalInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        medicalInfo: {
          ...prev.medicalInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required');
        setLoading(false);
        return;
      }

      const url = editingMember 
        ? buildApiUrl(`${API_ENDPOINTS.CLIENT_UPDATE_MEMBER}/${editingMember._id}`)
        : buildApiUrl(API_ENDPOINTS.CLIENT_ADD_MEMBER);
      
      const method = editingMember ? 'PUT' : 'POST';
      
      // Prepare data, excluding empty dateOfBirth
      const submitData = { ...formData };
      if (submitData.dateOfBirth === '') {
        submitData.dateOfBirth = undefined;
      }
      
      const response = await authConfig.makeAuthenticatedRequest(
        url,
        {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        }
      );

      // Check response status before parsing JSON
      if (!response.ok) {
        // Try to get error message
        let errorMessage = 'Failed to add member';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, get text
          const text = await response.text();
          errorMessage = text || `Server error: ${response.status} ${response.statusText}`;
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setFormData(getInitialFormData());
        onSuccess(data.data, editingMember ? 'updated' : 'added');
        onClose();
      } else {
        setError(data.message || (editingMember ? 'Failed to update member' : 'Failed to add member'));
      }
    } catch (err) {
      console.error('Error saving member:', err);
      setError(editingMember ? 'Failed to update member. Please try again.' : 'Failed to add member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {editingMember ? 'Edit Family Member' : 'Add Family Member'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Relationship *
                </label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                >
                  <option value="child">Child</option>
                  <option value="spouse">Spouse</option>
                  <option value="dependent">Dependent</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Emergency Contact
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Relationship to Member
                </label>
                <input
                  type="text"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleChange}
                  placeholder="e.g., Parent, Guardian"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Medical Information (Optional)
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Allergies
                </label>
                <textarea
                  name="medicalInfo.allergies"
                  value={formData.medicalInfo.allergies}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Medications
                </label>
                <textarea
                  name="medicalInfo.medications"
                  value={formData.medicalInfo.medications}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Medical Conditions
                </label>
                <textarea
                  name="medicalInfo.conditions"
                  value={formData.medicalInfo.conditions}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (editingMember ? 'Updating...' : 'Adding...') : (editingMember ? 'Update Member' : 'Add Member')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

