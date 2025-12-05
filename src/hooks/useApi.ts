"use client";

import { useAuth } from "@/auth/useAuth";
import { request, requestHeader } from "@/lib/request";
import { getIdToken } from "@/service/firebase/token";

export const useApi = () => {
  const api = <T>(url: string, method: string, body?: T) => {
    return requestHeader(url, method, body);
  };

  return { api, request };
};
