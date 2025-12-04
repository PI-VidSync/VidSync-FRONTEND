import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";

/**
 * Send a password reset email to the provided address.
 * @param email Account email
 */
export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}
