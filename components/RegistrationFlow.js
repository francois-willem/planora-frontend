// components/RegistrationFlow.js
'use client'
import { useState, useEffect } from 'react';
import { buildApiUrl, API_ENDPOINTS } from '../lib/config';

export default function RegistrationFlow({ onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [registrationType, setRegistrationType] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    businessCode: '',
    businessId: '',
    message: '',
    invitationToken: '',
    registrationType: '', // 'self', 'child', 'both'
    childFirstName: '',
    childLastName: '',
    childAge: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [businessCodeInfo, setBusinessCodeInfo] = useState(null);

  // Load discoverable businesses
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.BUSINESSES_DISCOVER));
        const data = await response.json();
        if (data.success) {
          setBusinesses(data.data);
        }
      } catch (error) {
        console.error('Error loading businesses:', error);
      }
    };
    loadBusinesses();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateBusinessCode = async (code) => {
    if (!code) return;
    
    try {
      const response = await fetch(buildApiUrl(`${API_ENDPOINTS.BUSINESSES_VALIDATE_CODE}/${code}`));
      const data = await response.json();
      
      if (data.success) {
        setBusinessCodeInfo(data.data);
        setError('');
      } else {
        setBusinessCodeInfo(null);
        setError(data.message);
      }
    } catch (error) {
      setBusinessCodeInfo(null);
      setError('Error validating business code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let endpoint = '';
      let payload = {};

      switch (registrationType) {
        case 'business-code':
          endpoint = buildApiUrl(API_ENDPOINTS.REGISTER_WITH_CODE);
          payload = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            businessCode: formData.businessCode
          };
          break;
        case 'business-discovery':
          endpoint = buildApiUrl(API_ENDPOINTS.REQUEST_BUSINESS_ACCESS);
          payload = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            businessId: formData.businessId,
            message: formData.message
          };
          break;
        case 'invitation':
          endpoint = buildApiUrl(API_ENDPOINTS.REGISTER_WITH_INVITATION);
          payload = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            invitationToken: formData.invitationToken
          };
          break;
        default:
          throw new Error('Invalid registration type');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        // Store user data
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userData', JSON.stringify({
          _id: result._id,
          email: result.email,
          role: result.role,
          businessAssociations: result.businessAssociations || [],
          currentBusiness: result.currentBusiness,
          isSuperAdmin: result.isSuperAdmin || false
        }));

        // Move to registration type selection step
        setStep(3);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBusinessTypeIcon = (businessType) => {
    switch (businessType) {
      case 'swim-school': return '🏊‍♀️';
      case 'fitness-center': return '💪';
      case 'dance-studio': return '💃';
      default: return '🏢';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-12 h-1 mx-2 ${
                  step > stepNumber
                    ? 'bg-blue-600'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-600 dark:text-slate-400">
          <span>Choose Method</span>
          <span>Enter Details</span>
          <span>Registration Type</span>
          <span>Complete</span>
        </div>
      </div>

      {/* Step 1: Registration Type Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              How would you like to register?
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Choose the method that works best for you
            </p>
          </div>

          <div className="grid gap-4">
            {/* Business Code Option */}
            <button
              onClick={() => {
                setRegistrationType('business-code');
                setStep(2);
              }}
              className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔑</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    I have a business code
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Enter a code provided by your business to join immediately
                  </p>
                </div>
              </div>
            </button>

            {/* Business Discovery Option */}
            <button
              onClick={() => {
                setRegistrationType('business-discovery');
                setStep(2);
              }}
              className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Find and join a business
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Search for businesses and request to join (requires approval)
                  </p>
                </div>
              </div>
            </button>

            {/* Invitation Option */}
            <button
              onClick={() => {
                setRegistrationType('invitation');
                setStep(2);
              }}
              className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    I have an invitation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Register using an invitation link from a business
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {registrationType === 'business-code' ? 'Enter Business Code' : 'Select Business'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              {registrationType === 'business-code' 
                ? 'Enter the code provided by your business'
                : 'Choose the business you want to join'
              }
            </p>
          </div>

          {/* Invitation Token Input */}
          {registrationType === 'invitation' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Invitation Token
                </label>
                <input
                  type="text"
                  name="invitationToken"
                  value={formData.invitationToken || ''}
                  onChange={handleInputChange}
                  placeholder="Enter invitation token from email"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100"
                />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  This token was sent to you in an invitation email
                </p>
              </div>
            </div>
          )}

          {/* Business Code Input */}
          {registrationType === 'business-code' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Business Code
                </label>
                <input
                  type="text"
                  name="businessCode"
                  value={formData.businessCode}
                  onChange={(e) => {
                    handleInputChange(e);
                    validateBusinessCode(e.target.value);
                  }}
                  placeholder="Enter 6-character code"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100"
                  maxLength="6"
                  style={{ textTransform: 'uppercase' }}
                />
                {businessCodeInfo && (
                  <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getBusinessTypeIcon(businessCodeInfo.business.businessType)}</span>
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">
                          {businessCodeInfo.business.name}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          {businessCodeInfo.business.businessType}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Business Selection */}
          {registrationType === 'business-discovery' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Business
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {businesses.map((business) => (
                    <button
                      key={business._id}
                      type="button"
                      onClick={() => {
                        setSelectedBusiness(business);
                        setFormData(prev => ({ ...prev, businessId: business._id }));
                      }}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-colors duration-200 ${
                        selectedBusiness?._id === business._id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getBusinessTypeIcon(business.businessType)}</span>
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-slate-100">
                            {business.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {business.businessType} • {business.address?.city}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedBusiness && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell the business why you want to join..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              )}
            </div>
          )}

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || 
                (registrationType === 'business-code' && !businessCodeInfo) || 
                (registrationType === 'business-discovery' && !selectedBusiness) ||
                (registrationType === 'invitation' && !formData.invitationToken)
              }
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Registration Type Selection */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              How would you like to register?
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Choose how you want to use this account
            </p>
          </div>

          <div className="grid gap-4">
            {/* Self Registration */}
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, registrationType: 'self' }));
                setStep(4);
              }}
              className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Self Registration
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    I want to attend classes myself
                  </p>
                </div>
              </div>
            </button>

            {/* Child Registration */}
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, registrationType: 'child' }));
                setStep(4);
              }}
              className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👶</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Child Registration
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    I want to register my child for classes
                  </p>
                </div>
              </div>
            </button>

            {/* Both Registration */}
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, registrationType: 'both' }));
                setStep(4);
              }}
              className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Both
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    I want to register both myself and my child
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Registration Successful!
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Welcome to Planora! You can now access your dashboard.
            </p>
          </div>
          <button
            onClick={() => onComplete({ registrationType: formData.registrationType })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
