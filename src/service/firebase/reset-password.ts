import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}