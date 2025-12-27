// src/services/Api.ts
import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  headers: { Accept: "application/json" },
});

Api.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

Api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    // Avoid redirect loops
    const path = window.location.pathname;

    if (status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("permissions");

      if (path !== "/login") window.location.href = "/login";
    }

    // if (status === 403) {
    //   if (path !== "/forbidden") window.location.href = "/forbidden";
    // }

    return Promise.reject(err);
  }
);

export default Api;
