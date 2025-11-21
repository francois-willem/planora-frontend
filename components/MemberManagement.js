// components/MemberManagement.js
// Component for managing family members on a client account

"use client"
import { useState, useEffect } from 'react';
import { authConfig } from '../lib/auth';
import { buildApiUrl, API_ENDPOINTS } from '../lib/config';
import AddMemberModal from './AddMemberModal';

export default function MemberManagement() {
  const [members, setMembers] = useState({ primary: null, members: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(API_ENDPOINTS.CLIENT_MEMBERS)
      );

      if (response.ok) {
        const data = await response.json();
        setMembers(data.data);
        setError('');
      } else {
        // Try to parse error as JSON, but handle HTML responses
        let errorData;
        try {
          const text = await response.text();
          errorData = JSON.parse(text);
        } catch (parseError) {
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }
        setError(errorData.message || 'Failed to load members');
      }
    } catch (err) {
      console.error('Error loading members:', err);
      setError('Failed to load members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = (newMember, action = 'added') => {
    if (action === 'updated') {
      // Update existing member in the list
      setMembers(prev => ({
        ...prev,
        members: prev.members.map(m => m._id === newMember._id ? newMember : m)
      }));
      setSuccess('Member updated successfully!');
    } else {
      // Add new member to the list
      setMembers(prev => ({
        ...prev,
        members: [...prev.members, newMember]
      }));
      setSuccess('Member added successfully!');
    }
    setTimeout(() => setSuccess(''), 3000);
    setEditingMember(null);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingMember(null);
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(`${API_ENDPOINTS.CLIENT_REMOVE_MEMBER}/${memberId}`),
        {
          method: 'DELETE'
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMembers(prev => ({
          ...prev,
          members: prev.members.filter(m => m._id !== memberId)
        }));
        setSuccess('Member removed successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to remove member');
      }
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getRelationshipLabel = (relationship) => {
    const labels = {
      self: 'Account Owner',
      child: 'Child',
      spouse: 'Spouse',
      dependent: 'Dependent',
      other: 'Other'
    };
    return labels[relationship] || relationship;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300">Loading members...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Family Members
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Manage members on your account
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          + Add Member
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Primary Account Owner */}
      {members.primary && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {members.primary.firstName} {members.primary.lastName}
                </h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium">
                  {getRelationshipLabel(members.primary.relationship)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-medium">Date of Birth:</span> {formatDate(members.primary.dateOfBirth)}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {members.primary.phone || 'Not provided'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Added Members ({members.members.length})
        </h4>

        {members.members.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-4">No members added yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Add your first member
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {members.members.map((member) => (
              <div
                key={member._id}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {member.firstName} {member.lastName}
                      </h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
                        {getRelationshipLabel(member.relationship)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                      <div>
                        <span className="font-medium">Date of Birth:</span> {formatDate(member.dateOfBirth)}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {member.phone || 'Not provided'}
                      </div>
                      {member.emergencyContact?.name && (
                        <div>
                          <span className="font-medium">Emergency Contact:</span> {member.emergencyContact.name}
                        </div>
                      )}
                    </div>
                    {member.medicalInfo && (member.medicalInfo.allergies || member.medicalInfo.conditions) && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                          Medical Information:
                        </p>
                        {member.medicalInfo.allergies && (
                          <p className="text-xs text-amber-700 dark:text-amber-300">
                            Allergies: {member.medicalInfo.allergies}
                          </p>
                        )}
                        {member.medicalInfo.conditions && (
                          <p className="text-xs text-amber-700 dark:text-amber-300">
                            Conditions: {member.medicalInfo.conditions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditMember(member)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Edit member"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Remove member"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Member Modal */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSuccess={handleAddMember}
        editingMember={editingMember}
      />
    </div>
  );
}

