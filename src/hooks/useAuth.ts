import { useState, useCallback } from "react";
import { adminLogin, adminLogout, isAdmin } from "../api/admin";

export function useAuth() {
  const [admin, setAdmin] = useState(isAdmin);

  const login = useCallback((password: string): boolean => {
    if (adminLogin(password)) {
      setAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    adminLogout();
    setAdmin(false);
  }, []);

  return { isAdmin: admin, login, logout };
}
