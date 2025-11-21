// src/app/employee/register/page.js
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '../../../../lib/ThemeContext';
import Navbar from '../../../../components/Navbar';

export default function EmployeeRegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    businessCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

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

      // Register employee with Express backend using business code
      const response = await fetch('http://localhost:4000/api/auth/register-with-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          businessCode: formData.businessCode,
          role: 'employee' // Specify this is an employee registration
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        if (result.employeeStatus === 'pending') {
          setSuccess('Registration successful! Your account is pending approval by the business administrator.');
          // Store token and user data in localStorage
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userData', JSON.stringify({
            _id: result._id,
            email: result.email,
            role: result.role,
            businessAssociations: result.businessAssociations || [],
            currentBusiness: result.currentBusiness,
            isSuperAdmin: result.isSuperAdmin || false,
            employeeStatus: result.employeeStatus
          }));
          setTimeout(() => {
            router.push('/employee/pending-approval');
          }, 2000);
        } else {
          setSuccess('Registration successful! Redirecting to your dashboard...');
          // Store token and user data in localStorage
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userData', JSON.stringify({
            _id: result._id,
            email: result.email,
            role: result.role,
            businessAssociations: result.businessAssociations || [],
            currentBusiness: result.currentBusiness,
            isSuperAdmin: result.isSuperAdmin || false,
            clientStatus: result.clientStatus || 'approved'
          }));
          setTimeout(() => {
            router.push('/employee/dashboard');
          }, 2000);
        }
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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Navbar showAuth={false} />
        
        <main className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Employee Registration
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Join your swimming school team as an employee
                </p>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Code */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Business Code *
                  </label>
                  <input
                    type="text"
                    name="businessCode"
                    value={formData.businessCode}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Enter your business code"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Get this code from your business administrator
                  </p>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    Personal Information
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

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    Account Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Register as Employee'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Already have an account?{' '}
                  <a href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    Sign in here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
