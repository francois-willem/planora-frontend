// lib/auth.js
// Authentication utilities for Express + MongoDB backend
// This file provides authentication interface for the frontend
// It handles login, registration, logout, and token management

import { buildApiUrl, API_ENDPOINTS } from './config'; // Import API configuration

// Main authentication configuration object
// Contains all the functions needed for user authentication
export const authConfig = {
  // Authentication functions that will connect to Express backend
  
  // Function to sign in a user with email and password
  signIn: async (email, password) => {
    try {
      // Make HTTP POST request to login endpoint
      const response = await fetch(buildApiUrl(API_ENDPOINTS.LOGIN), {
        method: 'POST', // HTTP method for login
        headers: {
          'Content-Type': 'application/json', // Tell server we're sending JSON data
        },
        body: JSON.stringify({ email, password }), // Convert credentials to JSON string
      });
      
      // Parse the response from server
      const data = await response.json();
      
      // Check if login was successful (HTTP status 200-299)
      if (response.ok) {
        // Store authentication token in browser's localStorage
        // This token is used for all future API requests
        localStorage.setItem('authToken', data.token);
        
        // Store user information in localStorage for easy access
        localStorage.setItem('userData', JSON.stringify({
          _id: data._id, // Unique user ID from database
          email: data.email, // User's email address
          firstName: data.firstName, // User's first name
          lastName: data.lastName, // User's last name
          role: data.role, // User role: 'admin', 'business', 'client', etc.
          businessAssociations: data.businessAssociations || [], // Businesses user is associated with
          currentBusiness: data.currentBusiness, // Currently selected business
          isSuperAdmin: data.isSuperAdmin || false, // Whether user has super admin privileges
          clientStatus: data.clientStatus || 'approved' // Status for client users
        }));
        
        // Return success with user data
        return { user: data, error: null };
      } else {
        // Login failed - return error message
        return { user: null, error: data.message || 'Login failed' };
      }
    } catch (error) {
      // Network error or other exception occurred
      console.error('Login error:', error);
      return { user: null, error: 'Network error. Please try again.' };
    }
  },
  
  // Function to register a new user
  signUp: async (email, password, userData = {}) => {
    try {
      // Make HTTP POST request to registration endpoint
      const response = await fetch(buildApiUrl(API_ENDPOINTS.REGISTER), {
        method: 'POST', // HTTP method for registration
        headers: {
          'Content-Type': 'application/json', // Tell server we're sending JSON data
        },
        // Spread userData to include additional fields like name, role, etc.
        body: JSON.stringify({ email, password, ...userData }),
      });
      
      // Parse the response from server
      const data = await response.json();
      
      // Check if registration was successful
      if (response.ok) {
        // Store authentication token in localStorage
        localStorage.setItem('authToken', data.token);
        
        // Store user information in localStorage
        localStorage.setItem('userData', JSON.stringify({
          _id: data._id, // Unique user ID from database
          email: data.email, // User's email address
          role: data.role, // User role: 'admin', 'business', 'client', etc.
          businessAssociations: data.businessAssociations || [], // Businesses user is associated with
          currentBusiness: data.currentBusiness, // Currently selected business
          isSuperAdmin: data.isSuperAdmin || false, // Whether user has super admin privileges
          clientStatus: data.clientStatus || 'approved' // Status for client users
        }));
        
        // Return success with user data
        return { user: data, error: null };
      } else {
        // Registration failed - return error message
        return { user: null, error: data.message || 'Registration failed' };
      }
    } catch (error) {
      // Network error or other exception occurred
      console.error('Registration error:', error);
      return { user: null, error: 'Network error. Please try again.' };
    }
  },
  
  // Function to sign out the current user
  signOut: async () => {
    try {
      // Get the current authentication token
      const token = localStorage.getItem('authToken');
      
      // If token exists, notify the server about logout
      if (token) {
        await fetch(buildApiUrl(API_ENDPOINTS.LOGOUT), {
          method: 'POST', // HTTP method for logout
          headers: {
            'Authorization': `Bearer ${token}`, // Include token for server validation
          },
        });
      }
      
      // Always remove local authentication data, even if server request fails
      localStorage.removeItem('authToken'); // Remove authentication token
      localStorage.removeItem('userData'); // Remove user information
      
      return { error: null }; // Return success
    } catch (error) {
      // Even if logout request fails, we still want to clear local data
      console.error('Logout error:', error);
      
      // Still remove token even if logout request fails
      // This ensures user is logged out locally even if server is unreachable
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      return { error: null }; // Return success since local logout succeeded
    }
  },
  
  // Function to get the currently logged-in user
  getCurrentUser: () => {
    // Check if user is logged in by looking for token and user data
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    // Both token and user data must exist for a valid session
    if (token && userData) {
      try {
        // Parse the JSON string back to a JavaScript object
        return JSON.parse(userData);
      } catch (error) {
        // If user data is corrupted, clear it and return null
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        return null;
      }
    }
    
    // If there's a token but no user data, clear it and return null
    // This handles cases where data might be partially corrupted
    if (token && !userData) {
      localStorage.removeItem('authToken');
      return null;
    }
    
    // No valid session found
    return null;
  },
  
  // Role-based access control functions for Planora
  
  // Get the user's role (admin, business, client, etc.)
  getUserRole: (user) => {
    // Roles: 'admin', 'business', 'client', 'super-admin'
    // The ?. operator safely accesses the role property even if user is null
    return user?.role || null;
  },

  // Get the currently selected business context for the user
  getCurrentBusiness: (user) => {
    // Returns the business the user is currently working with
    return user?.currentBusiness || null;
  },

  // Get all businesses the user is associated with
  getBusinessAssociations: (user) => {
    // Returns array of all businesses user has access to
    return user?.businessAssociations || [];
  },

  // Check if user has super admin privileges
  isSuperAdmin: (user) => {
    // Super admin can access all businesses and system settings
    return user?.isSuperAdmin || user?.role === 'super-admin';
  },
  
  // Check if user has permission for specific actions based on their role
  hasPermission: (user, action) => {
    const role = authConfig.getUserRole(user);
    
    // Define what each role can do
    const permissions = {
      admin: ['manage_businesses', 'view_reports', 'manage_users', 'system_settings'],
      business: ['manage_sessions', 'manage_clients', 'view_reports', 'manage_staff'],
      client: ['view_schedule', 'book_classes', 'cancel_classes', 'view_profile']
    };
    
    // Check if the user's role has the requested permission
    return permissions[role]?.includes(action) || false;
  },

  // Make authenticated requests to the backend API
  makeAuthenticatedRequest: async (url, options = {}) => {
    // Get the authentication token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If no token exists, throw an error
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Set up default headers with authentication
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in Authorization header
        'Content-Type': 'application/json', // Default content type
        ...options.headers // Allow custom headers to override defaults
      }
    };

    // Make the request with authentication headers
    return fetch(url, { ...options, ...defaultOptions });
  }
};

// Authentication state management class
// This class manages the global authentication state and notifies components when it changes
export class AuthState {
  constructor() {
    this.user = null; // Current user data (null if not logged in)
    this.loading = true; // Whether authentication is being checked
    this.listeners = []; // Array of functions to call when state changes
  }
  
  // Subscribe to authentication state changes
  // Returns a function to unsubscribe
  subscribe(callback) {
    this.listeners.push(callback); // Add callback to listeners array
    return () => {
      // Return unsubscribe function that removes this callback
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  // Notify all listeners that the authentication state has changed
  notify() {
    this.listeners.forEach(listener => listener(this.user, this.loading));
  }
  
  // Set the current user and notify all listeners
  setUser(user) {
    this.user = user; // Update user data
    this.loading = false; // Authentication check is complete
    this.notify(); // Tell all components about the change
  }
  
  // Set the loading state and notify listeners
  setLoading(loading) {
    this.loading = loading; // Update loading state
    this.notify(); // Tell all components about the change
  }
}

// Global authentication state instance
// This is shared across the entire application
export const authState = new AuthState();
