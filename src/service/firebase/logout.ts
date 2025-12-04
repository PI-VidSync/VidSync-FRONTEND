import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

/** Logout the current Firebase user. */
export async function logout() {
  await signOut(auth);
}
