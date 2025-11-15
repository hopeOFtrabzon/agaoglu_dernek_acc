import axios from "axios";

let authToken = null;
let unauthorizedHandler = null;

export const api = axios.create({
  baseURL: "http://localhost:8000"
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof unauthorizedHandler === "function") {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  authToken = token;
};

export const clearAuthToken = () => {
  authToken = null;
};

export const registerUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};
