import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";

export async function login(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function loginWithFacebook() {
  const result = await signInWithPopup(auth, facebookProvider);
  return result.user;
}