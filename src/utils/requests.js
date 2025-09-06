// Utility functions for managing resignation and termination requests in localStorage

const REQUESTS_KEY = 'hrm_requests';

// Get all requests from localStorage
export const getRequests = () => {
  const stored = localStorage.getItem(REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save requests to localStorage
export const saveRequests = (requests) => {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
};

// Add a new request
export const addRequest = (request) => {
  const requests = getRequests();
  const newRequest = {
    id: Date.now(),
    ...request,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  requests.push(newRequest);
  saveRequests(requests);
  return newRequest;
};

// Update request status
export const updateRequestStatus = (id, status) => {
  const requests = getRequests();
  const index = requests.findIndex(req => req.id === id);
  if (index !== -1) {
    requests[index].status = status;
    saveRequests(requests);
  }
};

// Get pending requests
export const getPendingRequests = () => {
  return getRequests().filter(req => req.status === 'pending');
};

// Get requests by type
export const getRequestsByType = (type) => {
  return getRequests().filter(req => req.type === type);
};

// Check if there's a pending request for a user
export const hasPendingRequest = (username, type) => {
  return getPendingRequests().some(req => req.username === username && req.type === type);
};

// Get request for a user
export const getRequestForUser = (username, type) => {
  return getRequests().find(req => req.username === username && req.type === type);
};
