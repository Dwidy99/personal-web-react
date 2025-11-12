// import axios
import axios from "axios";

// import Cookies
import Cookies from "js-cookie";

// ambil baseURL dari .env
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://127.0.0.1:8000"
    : "https://api.dwiyulianto.my.id/api");

// buat instance axios
const Api = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// handle unauthenticated & forbidden
Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // remove all cookies
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("permissions");
      window.location = "/";
    } else if (status === 403) {
      window.location = "/forbidden";
    } else {
      return Promise.reject(error);
    }
  }
);

export default Api;
