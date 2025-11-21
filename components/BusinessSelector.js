// components/BusinessSelector.js
"use client"
import { useState, useEffect } from 'react';
import { buildApiUrl, API_ENDPOINTS } from '../lib/config';

export default function BusinessSelector({ 
  user, 
  onBusinessChange, 
  className = '' 
}) {
  const [businesses, setBusinesses] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user && user.businessAssociations) {
      setBusinesses(user.businessAssociations);
      setCurrentBusiness(user.currentBusiness);
    }
  }, [user]);

  const handleBusinessSwitch = async (businessId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(buildApiUrl(API_ENDPOINTS.SWITCH_BUSINESS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ businessId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setCurrentBusiness(data.currentBusiness);
        setShowDropdown(false);
        
        // Notify parent component of business change
        if (onBusinessChange) {
          onBusinessChange(data.currentBusiness);
        }
        
        // Reload the page to refresh all data with new business context
        window.location.reload();
      } else {
        console.error('Failed to switch business:', data.message);
        alert('Failed to switch business. Please try again.');
      }
    } catch (error) {
      console.error('Error switching business:', error);
      alert('Network error. Please try again.');
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

  // Don't show selector for super-admin or users with only one business
  if (!user || user.isSuperAdmin || businesses.length <= 1) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={loading}
        className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 min-w-[280px]"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {getBusinessTypeIcon(currentBusiness?.businessId?.businessType)}
            </span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                {currentBusiness?.businessId?.name || 'Select Business'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentBusiness?.role || 'No role'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <svg 
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Your Businesses
            </div>
            {businesses.map((business) => (
              <button
                key={business._id}
                onClick={() => handleBusinessSwitch(business.businessId._id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                  currentBusiness?._id === business._id
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">
                  {getBusinessTypeIcon(business.businessId.businessType)}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                    {business.businessId.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {business.businessId.email}
                  </p>
                </div>
                {currentBusiness?._id === business._id && (
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
