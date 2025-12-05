import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";

/**
 * Sign in using email and password.
 * @param email User email
 * @param password User password
 */
export async function login(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

/** Sign in using Google OAuth popup. */
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/** Sign in using GitHub OAuth popup. */
export async function loginWithGithub() {
  const result = await signInWithPopup(auth, githubProvider);
  return result.user;
}
