"use client";

import { useApi } from "@/hooks/useApi";
import { request } from "@/lib/request";

export const useAuthService = () => {
  const { api } = useApi();

  return {
    verifyToken: (token: string) =>
      api("/auth/verify-token", "POST", { token }),

    updatePassword: (password: string, newPassword: string) =>
      api("/auth/update-password", "PUT", { password, newPassword }),

    updateProfile: (data: UserUpdate) =>
      api(`/auth/update`, "PUT", data),

    deleteUser: () => api(`/auth/delete`, "DELETE"),

    register: (user: UserRegister) =>
      request("/auth/register", "POST", user),
  };
};
