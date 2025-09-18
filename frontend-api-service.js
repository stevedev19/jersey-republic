// frontend/src/services/api.js
// Copy this file to your React frontend: src/services/api.js

const API_BASE_URL = 'http://localhost:3003';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // For cookies/sessions
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Product API methods
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      order: params.order || 'createdAt',
      ...(params.productCollection && { productCollection: params.productCollection }),
      ...(params.search && { search: params.search }),
    });

    return this.request(`/product/all?${queryParams}`);
  }

  async getProduct(id) {
    return this.request(`/product/${id}`);
  }

  // Member/Auth API methods
  async login(credentials) {
    return this.request('/member/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData) {
    return this.request('/member/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/member/logout', {
      method: 'POST',
    });
  }

  async getMemberDetail() {
    return this.request('/member/detail');
  }

  // Order API methods
  async createOrder(orderData) {
    return this.request('/order/create', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getMyOrders() {
    return this.request('/order/all');
  }

  async updateOrder(orderData) {
    return this.request('/order/update', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Restaurant API methods
  async getRestaurant() {
    return this.request('/member/restaurant');
  }

  async getTopUsers() {
    return this.request('/member/top-users');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Also export the class for custom instances if needed
export { ApiService };
