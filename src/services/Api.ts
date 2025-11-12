import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";

// Base URL dari environment atau fallback
const baseURL: string =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://127.0.0.1:8000"
    : "https://api.dwiyulianto.my.id/api");

// Membuat instance axios
const Api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptor untuk handle error global
Api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Hapus semua cookies saat unauthenticated
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("permissions");
      window.location.href = "/";
    } else if (status === 403) {
      window.location.href = "/forbidden";
    } else {
      return Promise.reject(error);
    }
  }
);

export default Api;
