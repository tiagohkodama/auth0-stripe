const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Make an authenticated API call
 * @param {string} endpoint - API endpoint (e.g., '/api/payments/create-payment-intent')
 * @param {Function} getAccessToken - Function to get access token from Auth0
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Object>} Response data
 */
export async function callApi(endpoint, getAccessToken, options = {}) {
  try {
    // Get access token from Auth0
    const token = await getAccessToken();

    // Make the API call
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    return data;

  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * Create a payment intent
 * @param {Function} getAccessToken - Auth0 getAccessTokenSilently function
 * @param {number} amount - Amount in cents
 * @param {string} email - User email
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Payment intent data with clientSecret
 */
export async function createPaymentIntent(getAccessToken, amount, email, metadata = {}) {
  return callApi('/api/payments/create-payment-intent', getAccessToken, {
    method: 'POST',
    body: JSON.stringify({ amount, email, metadata }),
  });
}

/**
 * Get payment status
 * @param {Function} getAccessToken - Auth0 getAccessTokenSilently function
 * @param {string} paymentIntentId - Payment Intent ID
 * @returns {Promise<Object>} Payment status data
 */
export async function getPaymentStatus(getAccessToken, paymentIntentId) {
  return callApi(`/api/payments/${paymentIntentId}`, getAccessToken);
}
