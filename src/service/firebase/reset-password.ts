import { confirmPasswordReset, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * Send a password reset email to the provided address.
 * @param email Account email
 */
export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

/**
 * Reset password using the out of band code.
 * 
 * @param oobCode 
 * @param newPassword 
 * @returns 
 */
export async function resetPasswordConfirm(oobCode: string, newPassword: string) {
  return await confirmPasswordReset(auth, oobCode, newPassword);
}
