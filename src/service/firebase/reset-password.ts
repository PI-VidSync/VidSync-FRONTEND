import { confirmPasswordReset, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export async function resetPasswordConfirm(oobCode: string, newPassword: string) {
  return await confirmPasswordReset(auth, oobCode, newPassword);
}