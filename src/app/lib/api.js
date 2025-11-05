// lib/api.js - Updated with better token management
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class ApiService {
  constructor() {
    this.token = null;
    this.initializeToken();
  }

  initializeToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
      console.log("🔐 Token initialized:", !!this.token);
    }
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem(
          "auth_user",
          JSON.stringify({ username: "admin" })
        );
        console.log("✅ Token stored in localStorage");
      } else {
        this.clearToken();
      }
    }
  }

  getToken() {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
    console.log("🔐 Getting token:", !!this.token);
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      console.log("🗑️ Token cleared from localStorage");
    }
  }

  async request(endpoint, options = {}) {
    const cleanBaseUrl = API_BASE_URL.replace(/\/$/, "");
    const cleanEndpoint = endpoint.replace(/^\//, "");
    const url = `${cleanBaseUrl}/${cleanEndpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    // Always try to get the latest token
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🔄 API Request: ${url}`, {
      method: config.method || "GET",
      hasToken: !!token,
      endpoint: endpoint,
    });

    try {
      const response = await fetch(url, config);

      console.log(
        `📡 Response Status: ${response.status} ${response.statusText}`,
        {
          endpoint: endpoint,
          hasToken: !!token,
        }
      );

      if (response.status === 401) {
        console.log("🔐 401 Unauthorized - clearing token");
        this.clearToken();
        throw new Error("Authentication failed. Please login again.");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Non-JSON response received:", text.substring(0, 200));

        if (text.includes("<!DOCTYPE html>") || text.includes("<html>")) {
          throw new Error(
            `Server returned HTML page. Check if endpoint exists: ${endpoint}`
          );
        }

        throw new Error(
          `Server returned non-JSON response. Status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        console.error(`❌ API Error ${response.status}:`, data);
        const errorMessage =
          data.error ||
          data.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      console.log(`✅ API Success: ${endpoint}`);
      return data;
    } catch (error) {
      console.error(`💥 API Request failed: ${url}`, error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please check:
• Backend server is running on port 5000
• URL is correct: ${API_BASE_URL}
• No firewall restrictions
• CORS is properly configured`);
      }

      throw new Error(`API request failed: ${error.message}`);
    }
  }

  // Auth methods
  async login(credentials) {
    console.log("🔐 Attempting login...");
    const response = await this.request("api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      console.log("✅ Login successful, setting token");
      this.setToken(response.token);
      if (typeof window !== "undefined" && response.user) {
        localStorage.setItem("auth_user", JSON.stringify(response.user));
      }
    } else {
      console.log("❌ Login failed - no token received");
    }

    return response;
  }

  async verifyToken() {
    const token = this.getToken();
    if (!token) {
      console.log("❌ No token available for verification");
      return { success: false, error: "No token available" };
    }

    console.log("🔐 Verifying token...");
    return this.request("api/auth/verify", {
      method: "POST",
    });
  }

  // Dashboard
  async getDashboard() {
    return this.request("api/admin/dashboard");
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request("api/dashboard/stats");
  }

  async getRecentActivities() {
    return this.request("api/dashboard/recent-activities");
  }

  async getSystemStatus() {
    return this.request("api/dashboard/system-status");
  }

  async healthCheck() {
    return this.request("health");
  }

// Visitor methods
async incrementVisitorCount() {
  return this.request("api/visitors/increment", {
    method: "POST",
  });
}

async getVisitorStats() {
  return this.request("api/visitors/stats");
}

async getTodayVisitorCount() {
  return this.request("api/visitors/today");
}

async getAllVisitorData() {
  return this.request("api/visitors/all");
}

async resetVisitorCounts() {
  return this.request("api/visitors/reset", {
    method: "DELETE",
  });
}

  // Services methods
  async getAdminServices() {
    return this.request("api/services");
  }

  async getServiceById(serviceId) {
    return this.request(`api/services/${serviceId}`);
  }

  async createService(serviceData) {
    return this.request("api/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(serviceId, serviceData) {
    return this.request(`api/services/${serviceId}`, {
      method: "PUT",
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(serviceId) {
    return this.request(`api/services/${serviceId}`, {
      method: "DELETE",
    });
  }

  // Blog methods
  async getBlogs(queryParams = {}) {
    try {
      const params = new URLSearchParams();
      if (queryParams.page) params.append("page", queryParams.page);
      if (queryParams.limit) params.append("limit", queryParams.limit);

      const queryString = params.toString();
      const endpoint = queryString ? `api/blogs?${queryString}` : "api/blogs";

      return await this.request(endpoint);
    } catch (error) {
      console.error("❌ Paginated blogs failed, trying non-paginated:", error);
      return await this.request("api/blogs/all");
    }
  }

  async getAllBlogs() {
    return this.request("api/blogs/all");
  }

  async getBlogById(blogId) {
    return this.request(`api/blogs/${blogId}`);
  }

  async getPublicBlogBySlug(slug) {
    return this.request(`api/blogs/slug/${slug}`);
  }

  // Create blog with FormData support
  async createBlog(formData) {
    const token = this.getToken();
    if (!token) {
      throw new Error("Authentication required. Please login first.");
    }

    const url = `${API_BASE_URL}/api/blogs`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        this.clearToken();
        throw new Error("Authentication failed");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create blog");
      }

      return data;
    } catch (error) {
      console.error("💥 Create blog failed:", error);
      throw error;
    }
  }

  // Update blog with FormData support
  async updateBlog(blogId, formData) {
    const token = this.getToken();
    if (!token) {
      throw new Error("Authentication required. Please login first.");
    }

    const url = `${API_BASE_URL}/api/blogs/${blogId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        this.clearToken();
        throw new Error("Authentication failed");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to update blog");
      }

      return data;
    } catch (error) {
      console.error("💥 Update blog failed:", error);
      throw error;
    }
  }

  // Update blog with JSON data
  async updateBlogJson(blogId, blogData) {
    return this.request(`api/blogs/${blogId}`, {
      method: "PUT",
      body: JSON.stringify(blogData),
    });
  }

  async deleteBlog(blogId) {
    return this.request(`api/blogs/${blogId}`, {
      method: "DELETE",
    });
  }

  // Other methods remain the same...
  async getGallery() {
    return this.request("api/gallery");
  }

  async deleteImage(imageId) {
    return this.request(`api/gallery/${imageId}`, {
      method: "DELETE",
    });
  }

  async getTestimonials() {
    return this.request("api/testimonials");
  }

  async getTestimonialById(testimonialId) {
    return this.request(`api/testimonials/${testimonialId}`);
  }

  async createTestimonial(testimonialData) {
    return this.request("api/testimonials", {
      method: "POST",
      body: JSON.stringify(testimonialData),
    });
  }

  async updateTestimonial(testimonialId, testimonialData) {
    return this.request(`api/testimonials/${testimonialId}`, {
      method: "PUT",
      body: JSON.stringify(testimonialData),
    });
  }

  async deleteTestimonial(testimonialId) {
    return this.request(`api/testimonials/${testimonialId}`, {
      method: "DELETE",
    });
  }

  async toggleTestimonialStatus(testimonialId) {
    return this.request(`api/testimonials/${testimonialId}/toggle`, {
      method: "PATCH",
    });
  }

  async getContactSubmissions() {
    try {
      const response = await this.request("api/contact");
      return response;
    } catch (error) {
      console.error("❌ Failed to fetch contact submissions:", error);
      return { success: true, data: [], count: 0 };
    }
  }

  async deleteContact(id) {
    try {
      const response = await this.request(`api/contact/${id}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error("❌ Failed to delete contact submission:", error);
      return { success: false, error: error.message };
    }
  }

  async submitContact(formData) {
    try {
      const response = await this.request("api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      return response;
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return { success: false, error: "Failed to submit contact form" };
    }
  }

  async getContactById(contactId) {
    return this.request(`api/contact/${contactId}`);
  }

  async updateContactStatus(contactId, status) {
    return this.request(`api/contact/${contactId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async healthCheck() {
    return this.request("health");
  }

  async logout() {
    this.clearToken();
    return { success: true };
  }
}

// Create a single instance
const apiService = new ApiService();

export default apiService;
export { apiService };
