import { request } from "@/hooks/useApi";

export async function register(user: UserRegister) {
  await request("/register", "POST", user);
}