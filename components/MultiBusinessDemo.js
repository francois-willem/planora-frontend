// components/MultiBusinessDemo.js
"use client"
import { useState } from 'react';

export default function MultiBusinessDemo() {
  const [selectedUser, setSelectedUser] = useState('client');

  const demoUsers = {
    client: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      role: 'client',
      businessAssociations: [
        {
          _id: '1',
          businessId: {
            _id: 'biz1',
            name: 'Sunrise Swim School',
            email: 'info@sunriseswim.com',
            businessType: 'swim-school'
          },
          role: 'client',
          isActive: true
        },
        {
          _id: '2',
          businessId: {
            _id: 'biz2',
            name: 'Aqua Fitness Center',
            email: 'contact@aquafitness.com',
            businessType: 'fitness-center'
          },
          role: 'client',
          isActive: true
        }
      ],
      currentBusiness: {
        _id: '1',
        businessId: {
          _id: 'biz1',
          name: 'Sunrise Swim School',
          email: 'info@sunriseswim.com',
          businessType: 'swim-school'
        },
        role: 'client'
      }
    },
    instructor: {
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      role: 'instructor',
      businessAssociations: [
        {
          _id: '3',
          businessId: {
            _id: 'biz1',
            name: 'Sunrise Swim School',
            email: 'info@sunriseswim.com',
            businessType: 'swim-school'
          },
          role: 'instructor',
          isActive: true
        },
        {
          _id: '4',
          businessId: {
            _id: 'biz3',
            name: 'Ocean Waves Academy',
            email: 'admin@oceanwaves.com',
            businessType: 'swim-school'
          },
          role: 'instructor',
          isActive: true
        }
      ],
      currentBusiness: {
        _id: '3',
        businessId: {
          _id: 'biz1',
          name: 'Sunrise Swim School',
          email: 'info@sunriseswim.com',
          businessType: 'swim-school'
        },
        role: 'instructor'
      }
    },
    admin: {
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      role: 'admin',
      businessAssociations: [
        {
          _id: '5',
          businessId: {
            _id: 'biz1',
            name: 'Sunrise Swim School',
            email: 'info@sunriseswim.com',
            businessType: 'swim-school'
          },
          role: 'admin',
          isActive: true
        },
        {
          _id: '6',
          businessId: {
            _id: 'biz4',
            name: 'Dance Studio Pro',
            email: 'info@dancestudiopro.com',
            businessType: 'dance-studio'
          },
          role: 'admin',
          isActive: true
        }
      ],
      currentBusiness: {
        _id: '5',
        businessId: {
          _id: 'biz1',
          name: 'Sunrise Swim School',
          email: 'info@sunriseswim.com',
          businessType: 'swim-school'
        },
        role: 'admin'
      }
    }
  };

  const currentUser = demoUsers[selectedUser];


  const getBusinessTypeIcon = (businessType) => {
    switch (businessType) {
      case 'swim-school': return '🏊‍♀️';
      case 'fitness-center': return '💪';
      case 'dance-studio': return '💃';
      default: return '🏢';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Multi-Business Access Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          See how users can access multiple businesses with different roles
        </p>
      </div>

      {/* User Selection */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Select User Type
        </h2>
        <div className="flex space-x-4">
          {Object.keys(demoUsers).map((userType) => (
            <button
              key={userType}
              onClick={() => setSelectedUser(userType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedUser === userType
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Current User Info */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Current User
        </h2>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {currentUser.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">{currentUser.email}</p>
          </div>
        </div>
      </div>

      {/* Business Associations */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Business Associations
        </h2>
        <div className="space-y-4">
          {currentUser.businessAssociations.map((association) => (
            <div
              key={association._id}
              className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                association._id === currentUser.currentBusiness._id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {getBusinessTypeIcon(association.businessId.businessType)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {association.businessId.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {association.businessId.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {association._id === currentUser.currentBusiness._id && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Current
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Dashboard Preview
        </h2>
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {currentUser.role === 'client' ? 'Your Dashboard' : 'Business Dashboard'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {currentUser.currentBusiness.businessId.name} - {currentUser.currentBusiness.role}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {getBusinessTypeIcon(currentUser.currentBusiness.businessId.businessType)}
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            This is how the dashboard would look for {currentUser.name} when working with{' '}
            <strong>{currentUser.currentBusiness.businessId.name}</strong> as a{' '}
            <strong>{currentUser.currentBusiness.role}</strong>.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300">Multiple business access</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300">Role-based permissions per business</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300">Easy business switching</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300">Context-aware dashboards</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300">Secure access control</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300">Backward compatibility</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
