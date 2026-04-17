const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

let authToken = localStorage.getItem("streetDogsToken") || "";

export const setAuthToken = (token) => {
  authToken = token || "";
  if (authToken) {
    localStorage.setItem("streetDogsToken", authToken);
  } else {
    localStorage.removeItem("streetDogsToken");
  }
};

const request = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(errorData.message || "Request failed");
  }

  return response.json();
};

export const api = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => request("/auth/me"),
  getFeedingPoints: () => request("/feeding-points"),
  addFeedingPoint: (payload) =>
    request("/feeding-points", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getSchedules: () => request("/schedules"),
  addSchedule: (payload) =>
    request("/schedules", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateScheduleStatus: (id, status) =>
    request(`/schedules/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  getAlerts: () => request("/alerts"),
  addAlert: ({ type, severity, feedingPoint, description, image }) => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("severity", severity);
    if (feedingPoint) {
      formData.append("feedingPoint", feedingPoint);
    }
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    return request("/alerts", {
      method: "POST",
      body: formData,
    });
  },
  updateAlertStatus: (id, status) =>
    request(`/alerts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  getVolunteers: () => request("/volunteers"),
  addVolunteer: (payload) =>
    request("/volunteers", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  toggleVolunteerStatus: (id) =>
    request(`/volunteers/${id}/toggle`, {
      method: "PATCH",
    }),
};
