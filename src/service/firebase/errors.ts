export function mapFirebaseAuthError(error: any): string {
  switch (error.code) {
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";

    case "auth/user-disabled":
      return "Este usuario ha sido deshabilitado.";

    case "auth/user-not-found":
      return "No existe una cuenta con este correo.";

    case "auth/wrong-password":
      return "La contraseña es incorrecta.";

    case "auth/too-many-requests":
      return "Has intentado demasiadas veces. Inténtalo más tarde.";

    case "auth/network-request-failed":
      return "Error de conexión. Verifica tu red e inténtalo nuevamente.";

    case "auth/invalid-credential":
      return "Las credenciales ingresadas no son válidas.";

    default:
      return "Ocurrió un error inesperado. Por favor, inténtalo nuevamente.";
  }
}