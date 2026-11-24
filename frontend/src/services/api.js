const API_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("fc-admin-token");

const request = async (endpoint, options = {}, protectedRoute = false) => {
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(protectedRoute
      ? { Authorization: `Bearer ${getToken()}` }
      : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

// PUBLIC WEBSITE APIs

export const getProducts = () =>
  request("/products/public");

export const getCategories = () =>
  request("/categories/public");

export const getSettings = () =>
  request("/settings/public");

export const getReviews = () =>
  request("/testimonials/public");

export const submitReview = (reviewData) =>
  request("/testimonials", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });

// ADMIN APIs

export const adminLogin = (email, password) =>
  request("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getAdminProfile = () =>
  request("/admin/profile", {}, true);

export const getAdminProducts = () =>
  request("/products", {}, true);

export const addProduct = (productData) =>
  request("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  }, true);

export const updateProduct = (id, productData) =>
  request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  }, true);

export const deleteProduct = (id) =>
  request(`/products/${id}`, {
    method: "DELETE",
  }, true);

export const getAdminCategories = () =>
  request("/categories", {}, true);

export const addCategory = (categoryData) =>
  request("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  }, true);

export const updateCategory = (id, categoryData) =>
  request(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  }, true);

export const deleteCategory = (id) =>
  request(`/categories/${id}`, {
    method: "DELETE",
  }, true);

export const getAdminSettings = () =>
  request("/settings", {}, true);

export const updateSettings = (settingsData) =>
  request("/settings", {
    method: "PUT",
    body: JSON.stringify(settingsData),
  }, true);

// ADMIN REVIEW MANAGEMENT

export const getAdminReviews = () =>
  request("/testimonials", {}, true);

export const updateReview = (id, reviewData) =>
  request(`/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify(reviewData),
  }, true);

export const deleteReview = (id) =>
  request(`/testimonials/${id}`, {
    method: "DELETE",
  }, true);