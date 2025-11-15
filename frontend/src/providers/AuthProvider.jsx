import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { api, clearAuthToken, registerUnauthorizedHandler, setAuthToken } from "../api";

const AuthContext = createContext(null);

const readPersistedState = () => {
  try {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("auth_user");
    return {
      token,
      user: user ? JSON.parse(user) : null
    };
  } catch (error) {
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [persisted] = useState(readPersistedState);
  const [token, setToken] = useState(persisted.token);
  const [user, setUser] = useState(persisted.user);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      localStorage.setItem("auth_token", token);
    } else {
      clearAuthToken();
      localStorage.removeItem("auth_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout();
    });
  }, [logout]);

  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      try {
        const form = new URLSearchParams();
        form.append("username", email);
        form.append("password", password);
        const { data } = await api.post("/auth/jwt/login", form, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        setToken(data.access_token);
        setAuthToken(data.access_token);
        const profile = await api.get("/users/me");
        setUser(profile.data);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        await api.post("/auth/register", payload);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      register,
      loading,
      isAuthenticated: Boolean(user && token)
    }),
    [user, token, login, logout, register, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
