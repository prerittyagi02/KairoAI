import { apiFetch } from "@/services/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  preferredLanguage: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  preferredLanguage: string;
  isActive: boolean;
};

export async function login(payload: LoginPayload) {
  return apiFetch<{ token: string }>("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signup(payload: SignupPayload) {
  return apiFetch<{ token: string }>("/api/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMe() {
  return apiFetch<{ user: AuthUser }>("/api/me", {
    method: "GET",
  });
}

export async function logout() {
  return apiFetch<{ success: true }>("/api/logout", {
    method: "POST",
  });
}
