import { request, requestHeader } from "../../hooks/useApi";

export const verifyToken = async (token: string) => {
  return requestHeader("/verify-token", "POST", { "Authorization": `Bearer ${token}` });
}

export const deleteUser = async (uid: string) => {
  return request(`/delete/${uid}`, "DELETE");
};