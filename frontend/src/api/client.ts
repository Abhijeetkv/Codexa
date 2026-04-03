import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach auth token + guest session ID
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("codexa_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const guestSessionId = localStorage.getItem("codexa_guest_session_id");
  if (guestSessionId) {
    config.headers["x-guest-session-id"] = guestSessionId;
  }

  return config;
});

// Response interceptor — handle 401s
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.loginRequired) {
      // Dispatch a custom event that the UI can listen to
      window.dispatchEvent(
        new CustomEvent("codexa:auth-required", {
          detail: { message: error.response.data.message },
        })
      );
    }
    return Promise.reject(error);
  }
);

export default client;
