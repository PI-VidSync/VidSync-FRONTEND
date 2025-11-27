import { requestHeader } from "../../hooks/useApi";

export const verifyToken = async (token: string) => {
  return requestHeader("/verify-token", "POST", { "Authorization": `Bearer ${token}` });
}