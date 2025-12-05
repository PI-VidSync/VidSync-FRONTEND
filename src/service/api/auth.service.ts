"use client";

import { useApi } from "@/hooks/useApi";
import { request } from "@/lib/request";

export const useAuthService = () => {
  const { api } = useApi();

  return {
    verifyToken: (token: string) =>
      api("/auth/verify-token", "POST", { token }),

    updatePassword: (oldPassword: string, newPassword: string) =>
      api("/auth/update-password", "PUT", { oldPassword, newPassword }),

    updateProfile: (data: UserUpdate) =>
      api(`/auth/update`, "PUT", data),

    deleteUser: () => api(`/auth/delete`, "DELETE"),

    register: (user: UserRegister) =>
      request("/auth/register", "POST", user),
  };
};
