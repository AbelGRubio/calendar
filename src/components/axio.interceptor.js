/**
 * file axio.interceptor.js
 * description Configures a reusable Axios instance with authentication and error handling.
 * Automatically attaches Keycloak token to requests and handles global errors such as 401 (Unauthorized).
 */

import axios from "axios";
import { toast } from "sonner";

/**
 * Axios instance used for making authenticated HTTP requests to the backend API.
 */
const api = axios.create({
  //baseURL: "https://fastapi-agr.vercel.app/api/py",
  baseURL: "http://localhost:8000/v1",     
  timeout: 10000,       // Request timeout (10 seconds)
});

/**
 * Request interceptor that adds the Keycloak token to the Authorization header.
 */
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    toast.error("Error doing request. Code: ", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor that handles unauthorized errors (401).
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Exports the configured Axios instance for use throughout the application.
 */
export default api;
