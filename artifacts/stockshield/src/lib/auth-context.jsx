import { createContext, useContext, useState, useEffect, useCallback } from "react";
const AuthContext = createContext(null);
function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/user", {
      credentials: "include"
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }).then(data => {
      if (!cancelled) {
        setUser(data.user ?? null);
        setIsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setUser(null);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const login = useCallback(() => {
    const base = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";
    window.location.href = `/api/login?returnTo=${encodeURIComponent(base)}`;
  }, []);
  const logout = useCallback(() => {
    window.location.href = "/api/logout";
  }, []);
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
}
export function AuthProvider({
  children
}) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}