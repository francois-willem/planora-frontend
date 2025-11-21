// components/ClassManagement.js
// This component manages swimming classes for a business
// It allows creating, editing, and deleting classes with different types (group/private)

'use client' // This directive tells Next.js this component runs on the client side
import { useState, useEffect } from 'react'; // React hooks for state management and side effects
import { authConfig } from '../lib/auth'; // Authentication utilities for making API calls
import { buildApiUrl, API_ENDPOINTS } from '../lib/config'; // API configuration and URL building

export default function ClassManagement() {
  // React state variables - these hold data that can change and trigger re-renders
  const [classes, setClasses] = useState([]); // Array of all classes for this business
  const [employees, setEmployees] = useState([]); // Array of employees (instructors) - not used in current implementation
  const [loading, setLoading] = useState(true); // Boolean to show loading spinner while data is being fetched
  const [error, setError] = useState(''); // String to store and display error messages
  const [showCreateModal, setShowCreateModal] = useState(false); // Boolean to control modal visibility
  const [editingClass, setEditingClass] = useState(null); // Object storing the class being edited (null when creating new)
  const [formData, setFormData] = useState({
    title: '', // Class name/title
    description: '', // Optional description of what the class covers
    classType: 'group', // Either 'group' or 'private' (1-on-1)
    maxCapacity: 8 // Maximum number of students allowed in the class
  });

  // useEffect hook runs when component first mounts (empty dependency array [])
  // This is where we fetch initial data from the API
  useEffect(() => {
    loadData(); // Call the function to load classes when component mounts
  }, []); // Empty array means this only runs once when component first loads

  // Async function to fetch classes from the backend API
  const loadData = async () => {
    setLoading(true); // Show loading spinner
    try {
      // Make authenticated API request to get all classes for this business
      // authConfig.makeAuthenticatedRequest automatically adds the auth token
      const classesResponse = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(API_ENDPOINTS.CLASSES) // Builds the full API URL
      );
      
      // Check if the API request was successful (status 200-299)
      if (classesResponse.ok) {
        const classesData = await classesResponse.json(); // Convert response to JavaScript object
        setClasses(classesData.data || []); // Update state with classes data, fallback to empty array
      }
    } catch (err) {
      // If there's a network error or other exception, show error message
      setError('Failed to load data');
    } finally {
      // Always hide loading spinner, whether request succeeded or failed
      setLoading(false);
    }
  };

  // Function called when the form is submitted (Create or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior (page refresh)
    setError(''); // Clear any previous error messages

    try {
      // Determine if we're creating a new class or updating an existing one
      const url = editingClass 
        ? buildApiUrl(`${API_ENDPOINTS.CLASSES_UPDATE}/${editingClass._id}`) // Update existing class
        : buildApiUrl(API_ENDPOINTS.CLASSES_CREATE); // Create new class
      
      // Use PUT for updates, POST for creation (REST API convention)
      const method = editingClass ? 'PUT' : 'POST';
      
      // Make authenticated API request with form data
      const response = await authConfig.makeAuthenticatedRequest(url, {
        method, // HTTP method (POST or PUT)
        headers: {
          'Content-Type': 'application/json', // Tell server we're sending JSON data
        },
        body: JSON.stringify(formData), // Convert form data to JSON string
      });

      // Check if the API request was successful
      if (response.ok) {
        await loadData(); // Refresh the classes list to show the new/updated class
        setShowCreateModal(false); // Close the modal
        setEditingClass(null); // Clear editing state
        resetForm(); // Reset form fields to default values
      } else {
        // If API returned an error, show the error message to user
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save class');
      }
    } catch (err) {
      // If there's a network error, show generic error message
      setError('Failed to save class');
    }
  };

  // Function called when user clicks "Edit" button on a class
  const handleEdit = (classItem) => {
    setEditingClass(classItem); // Store the class being edited
    // Pre-populate the form with the class's current data
    setFormData({
      title: classItem.title,
      description: classItem.description || '', // Use empty string if no description
      classType: classItem.classType,
      maxCapacity: classItem.maxCapacity
    });
    setShowCreateModal(true); // Open the modal in edit mode
  };

  // Function called when user clicks "Deactivate" button on a class
  const handleDelete = async (classId) => {
    // Show confirmation dialog - if user clicks "Cancel", exit the function
    if (!confirm('Are you sure you want to deactivate this class?')) return;

    try {
      // Make DELETE request to remove the class
      const response = await authConfig.makeAuthenticatedRequest(
        buildApiUrl(`${API_ENDPOINTS.CLASSES_DELETE}/${classId}`),
        { method: 'DELETE' } // HTTP DELETE method
      );

      if (response.ok) {
        await loadData(); // Refresh the classes list to remove the deleted class
      } else {
        // Show error message if deletion failed
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete class');
      }
    } catch (err) {
      // Show error message if network request failed
      setError('Failed to delete class');
    }
  };

  // Function to reset form fields to default values
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      classType: 'group',
      maxCapacity: 8
    });
  };

  // Function called whenever a form input changes (typing, selecting, etc.)
  const handleChange = (e) => {
    // Extract input properties from the event
    const { name, value, type, checked } = e.target;
    
    // Create new form data object with the updated field
    const newFormData = {
      ...formData, // Spread operator copies all existing form data
      [name]: type === 'checkbox' ? checked : // For checkboxes, use checked value
              type === 'number' ? Number(value) : value // For numbers, convert to number type
    };
    
    // Special logic: If class type is private, automatically set max capacity to 1
    if (name === 'classType' && value === 'private') {
      newFormData.maxCapacity = 1; // Private classes can only have 1 student
    }
    
    setFormData(newFormData); // Update the form state with new data
  };

  // Helper function to convert class type codes to user-friendly labels
  const getClassTypeLabel = (type) => {
    switch (type) {
      case 'group': return 'Group Class'; // Multiple students
      case 'private': return '1-on-1 Class'; // One student only
      default: return type; // Fallback to original value
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        {/* CSS animation creates a spinning circle */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Main component return - this is what gets rendered on the page
  return (
    <div className="space-y-6"> {/* Container with vertical spacing between sections */}
      {/* Header section with title and create button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Class Management
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Create and manage your swimming classes
          </p>
        </div>
        {/* Button to open the create class modal */}
        <button
          onClick={() => {
            resetForm(); // Clear form fields
            setEditingClass(null); // Set to create mode (not edit)
            setShowCreateModal(true); // Show the modal
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          Create New Class
        </button>
      </div>

      {/* Error Message - only shows if there's an error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Classes List - main content area */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        {/* Conditional rendering: show different content based on whether classes exist */}
        {classes.length === 0 ? (
          // Empty state - shown when no classes have been created yet
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {/* Book icon SVG */}
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400">No classes created yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Create your first class to get started
            </p>
          </div>
        ) : (
          // Table view - shown when classes exist
          <div className="overflow-x-auto"> {/* Allow horizontal scrolling on small screens */}
            <table className="w-full">
              {/* Table header */}
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Class Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Max Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              {/* Table body - dynamically generated from classes array */}
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {classes.map((classItem) => (<tr key={classItem._id}>
                    {/* Class title and description */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {classItem.title}
                        </div>
                        {/* Only show description if it exists */}
                        {classItem.description && (
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {classItem.description}
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Class type (Group or Private) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-slate-100">
                        {getClassTypeLabel(classItem.classType)}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Schedule this class in the Sessions tab
                      </div>
                    </td>
                    {/* Maximum capacity */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-slate-100">
                        {classItem.maxCapacity} students max
                      </div>
                    </td>
                    {/* Action buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* Edit button - opens modal with class data pre-filled */}
                        <button
                          onClick={() => handleEdit(classItem)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        {/* Delete button - removes the class */}
                        <button
                          onClick={() => handleDelete(classItem._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal - only shows when showCreateModal is true */}
      {showCreateModal && (
        /* Modal overlay - covers entire screen */
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* Modal content container */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal header with title and close button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {/* Dynamic title based on whether we're editing or creating */}
                  {editingClass ? 'Edit Class' : 'Create New Class'}
                </h3>
                {/* Close button (X) */}
                <button
                  onClick={() => {
                    setShowCreateModal(false); // Hide modal
                    setEditingClass(null); // Clear edit state
                    resetForm(); // Reset form fields
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {/* X icon SVG */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form for creating/editing classes */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Class Title *
                    </label>
                    {/* Text input for class name */}
                    <input
                      type="text"
                      name="title"
                      value={formData.title} // Controlled input - value comes from state
                      onChange={handleChange} // Call handleChange when user types
                      required // HTML5 validation - field must be filled
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      placeholder="e.g., Beginner Swimming"
                    />
                  </div>
                </div>

                {/* Description field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  {/* Multi-line text input for class description */}
                  <textarea
                    name="description"
                    value={formData.description} // Controlled input
                    onChange={handleChange} // Call handleChange when user types
                    rows={3} // Height of textarea
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Describe what this class covers..."
                  />
                </div>

                {/* Class Type selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Class Type *
                  </label>
                  {/* Dropdown to select between group and private classes */}
                  <select
                    name="classType"
                    value={formData.classType} // Controlled input
                    onChange={handleChange} // Call handleChange when selection changes
                    required // HTML5 validation
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="group">Group Class</option>
                    <option value="private">1-on-1 Class</option>
                  </select>
                </div>

                {/* Maximum capacity field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Max Capacity *
                  </label>
                  {/* Number input for maximum students */}
                  <input
                    type="number"
                    name="maxCapacity"
                    value={formData.maxCapacity} // Controlled input
                    onChange={handleChange} // Call handleChange when value changes
                    required // HTML5 validation
                    min="1" // Minimum value is 1
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>


                {/* Form action buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                  {/* Cancel button - closes modal without saving */}
                  <button
                    type="button" // Prevents form submission
                    onClick={() => {
                      setShowCreateModal(false); // Hide modal
                      setEditingClass(null); // Clear edit state
                      resetForm(); // Reset form fields
                    }}
                    className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  {/* Submit button - saves the form */}
                  <button
                    type="submit" // Triggers form submission
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    {/* Dynamic text based on whether we're editing or creating */}
                    {editingClass ? 'Update Class' : 'Create Class'}
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
