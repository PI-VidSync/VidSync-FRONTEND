import { request, requestHeader } from "../../hooks/useApi";

export const verifyToken = async (token: string) => {
  return requestHeader("/auth/verify-token", "POST", { "Authorization": `Bearer ${token}` });
}

export const deleteUser = async (uid: string) => {
  return request(`/auth/delete/${uid}`, "DELETE");
};

export const register = async (user: UserRegister) => {
  return request("/auth/register", "POST", user);
};