import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { mapFirebaseAuthError } from "./errors";

export async function login(email: string, password: string) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred.user;
  } catch (error) {
    throw new Error(mapFirebaseAuthError(error));
  }
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function loginWithGithub() {
  const result = await signInWithPopup(auth, githubProvider);
  return result.user;
}