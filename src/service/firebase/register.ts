import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * Register a new user using email/password.
 * @param user Object containing email and password
 */
export async function register(user: UserRegister) {
  const userCred = await createUserWithEmailAndPassword(auth, user.email, user.password);
  return userCred.user;
}
