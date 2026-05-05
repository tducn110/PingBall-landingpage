import { ADMIN_PASSWORD } from "../lib/env";

const SESSION_KEY = "ict_admin_session";

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAdmin(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}
