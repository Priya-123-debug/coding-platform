import axios from "axios";
const axiosClient = axios.create({
 baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // i told browser that attach cookie with it
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
