import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function register(user: UserRegister) {
  const userCred = await createUserWithEmailAndPassword(auth, user.email, user.password);
  return userCred.user;
}