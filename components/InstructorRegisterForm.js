"use client"
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function InstructorRegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invitationData, setInvitationData] = useState(null);
  const [validatingInvitation, setValidatingInvitation] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const invitationToken = searchParams.get('token');

  const validateInvitation = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/validate-invitation?token=${invitationToken}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setInvitationData(data.data);
      } else {
        setError(data.message || 'Invalid or expired invitation');
      }
    } catch (err) {
      setError('Failed to validate invitation. Please try again.');
    } finally {
      setValidatingInvitation(false);
    }
  }, [invitationToken]);

  useEffect(() => {
    if (invitationToken) {
      validateInvitation();
    } else {
      setError('Invalid invitation link. Please contact the business administrator.');
      setValidatingInvitation(false);
    }
  }, [invitationToken, validateInvitation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:4000/api/auth/register-with-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          invitationToken
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccess('Registration successful! Redirecting to your dashboard...');
        // Store token and redirect to instructor dashboard
        localStorage.setItem('authToken', result.token);
        setTimeout(() => {
          router.push('/instructor/dashboard');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (validatingInvitation) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Complete Your Instructor Registration
            </h1>
            {invitationData && (
              <p className="text-slate-600 dark:text-slate-300">
                You&apos;ve been invited to join <strong>{invitationData.business.name}</strong> as an instructor
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {invitationData && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
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
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
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
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                  Account Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="emergencyContact.name"
                      value={formData.emergencyContact.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact.phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Relationship *
                  </label>
                  <select
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="child">Child</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

