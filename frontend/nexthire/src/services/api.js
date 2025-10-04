// API service to connect frontend with backend
const API_BASE_URL = 'http://localhost:5000/api/auth';

// Helper function to make API requests
const apiRequest = async (endpoint, method = 'GET', data = null, isFormData = false) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {},
  };

  if (isFormData) {
    // For file uploads, let the browser set the Content-Type with boundary
    options.body = data;
  } else {
    // For JSON data
    options.headers['Content-Type'] = 'application/json';
    if (data) {
      options.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(url, options);
    
    // Check if response is empty
    const responseText = await response.text();
    if (!responseText) {
      throw new Error('Empty response from server');
    }
    
    // Try to parse JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    
    return result;
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

// Auth API functions
export const authAPI = {
  // Signup user
  signup: (userData, isFormData = false) => {
    return apiRequest('/signup', 'POST', userData, isFormData);
  },

  // Signup user with resume
  signupWithResume: (formData) => {
    return apiRequest('/signup', 'POST', formData, true);
  },

  // Login user
  login: (credentials) => {
    return apiRequest('/login', 'POST', credentials);
  }
};