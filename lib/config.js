// API Configuration
// This file contains all the configuration needed to communicate with the backend API

// Helper function to normalize API base URL
// Ensures the URL has a protocol (https:// or http://)
const normalizeApiBaseUrl = (url) => {
  if (!url) {
    return 'http://localhost:4000';
  }
  
  // Remove any trailing slashes
  const trimmed = url.trim().replace(/\/+$/, '');
  
  // If URL already has a protocol, return as is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // If no protocol, assume https:// for production (or http:// for localhost)
  // Check if it's localhost or 127.0.0.1 for http, otherwise use https
  if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1') || trimmed.startsWith('192.168.') || trimmed.startsWith('10.') || trimmed.startsWith('172.')) {
    return `http://${trimmed}`;
  }
  
  return `https://${trimmed}`;
};

// Base URL for the API server
// Uses environment variable if available, otherwise defaults to localhost
// Normalizes the URL to ensure it has a protocol
export const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

// Helper function to build complete API URLs
export const buildApiUrl = (endpoint) => {
  // Check if endpoint is provided
  if (!endpoint) {
    console.error('buildApiUrl called with undefined endpoint');
    return `${API_BASE_URL}/api/`; // Return base API URL if no endpoint
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Combine base URL with endpoint to create full API URL
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

// Common API endpoints
// This object contains all the API endpoint paths used throughout the application
export const API_ENDPOINTS = {
  // Authentication and user management endpoints
  LOGIN: '/auth/login', // User login
  REGISTER: '/auth/register', // User registration
  VERIFY: '/auth/verify', // Email verification
  REGISTER_WITH_CODE: '/auth/register-with-code', // Registration with business code
  REGISTER_WITH_INVITATION: '/auth/register-with-invitation', // Registration with invitation
  REQUEST_BUSINESS_ACCESS: '/auth/request-business-access', // Request access to business
  LOGOUT: '/auth/logout', // User logout
  SWITCH_BUSINESS: '/auth/switch-business', // Switch between businesses
  GET_USER_BUSINESSES: '/auth/businesses', // Get user's businesses
  CHANGE_PASSWORD: '/auth/change-password', // Change user password
  
  // Business management endpoints
  BUSINESSES_DISCOVER: '/businesses/discover', // Discover businesses by code
  BUSINESSES_VALIDATE_CODE: '/businesses/validate-code', // Validate business code
  BUSINESSES_REGISTER: '/businesses/register', // Register new business
  
  // Client-specific endpoints
  CLIENT_REGISTER: '/client/register', // Client registration
  CLIENT_DASHBOARD: '/clients/dashboard', // Client dashboard data
  CLIENT_PROFILE_UPDATE: '/clients/profile', // Update client profile
  CLIENT_MEMBERS: '/clients/members', // Get all members
  CLIENT_ADD_MEMBER: '/clients/members', // Add member
  CLIENT_UPDATE_MEMBER: '/clients/members', // Update member
  CLIENT_REMOVE_MEMBER: '/clients/members', // Remove member
  
  // Class management endpoints
  CLASSES: '/classes', // Get all classes
  CLASSES_CREATE: '/classes', // Create new class
  CLASSES_UPDATE: '/classes', // Update existing class
  CLASSES_DELETE: '/classes', // Delete class
  
  // Employee/Instructor management endpoints
  EMPLOYEES: '/employees', // Manage employees/instructors
  
  // Admin panel endpoints
  ADMIN_BUSINESSES: '/admin/businesses', // Admin business management
  ADMIN_STATS: '/admin/stats', // Admin statistics
  SUPER_ADMIN_BUSINESSES: '/super-admin/businesses', // Super admin business management
  SUPER_ADMIN_STATS: '/super-admin/stats', // Super admin statistics
};
