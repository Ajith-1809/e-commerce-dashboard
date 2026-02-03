const API_BASE_URL = "http://localhost:8080/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAnalyticsData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/analytics`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createOrder = async (order) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return await response.json();
};

export const deleteOrder = async (id) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete order');
};

// Kept for backward compatibility if needed, but getOrders does the same
export const getRecentOrders = getOrders;

export const getTopCities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/top-cities`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch cities');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateOrder = async (id, order) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error('Failed to update order');
  return await response.json();
};

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createProduct = async (product) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return await response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete product');
};

export const updateProduct = async (id, product) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return await response.json();
};

export const getCustomers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch customers');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createCustomer = async (customer) => {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(customer),
  });
  if (!response.ok) throw new Error('Failed to create customer');
  return await response.json();
};

export const updateCustomer = async (id, customer) => {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(customer),
  });
  if (!response.ok) throw new Error('Failed to update customer');
  return await response.json();
};

export const deleteCustomer = async (id) => {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete customer');
};