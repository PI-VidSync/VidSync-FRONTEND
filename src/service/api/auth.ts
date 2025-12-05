import { request, requestHeader } from "../../hooks/useApi";

export const verifyToken = async (token: string) => {
  return requestHeader("/auth/verify-token", "POST", { "Authorization": `Bearer ${token}` });
}

export const updatePassword = async (password: string, newPassword: string) => {
  return request("/auth/update-password", "POST", { password, newPassword });
}

export const updateProfile = async (data: { uid: string; firstName: string; lastName: string; email: string; age: number }) => {
  const { uid, ...rest } = data;
  return request(`/auth/update/${uid}`, "POST", rest);
}

export const deleteUser = async (uid: string) => {
  return request(`/auth/delete/${uid}`, "DELETE");
};

export const register = async (user: UserRegister) => {
  return request("/auth/register", "POST", user);
};