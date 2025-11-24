import { useRequest, useRequestHeader } from "../../hooks/useApi";

export const verifyToken = async (token: string) => {
  return useRequestHeader("/verify-token", "POST", { "Authorization": `Bearer ${token}` });
}