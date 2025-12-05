import { useCallback } from "react";
import { Toast } from "bootstrap";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number; // en milisegundos, por defecto 3000
}

/**
 * Hook providing helper methods to show Bootstrap toasts.
 */
export const useToast = () => {
  const showToast = useCallback((options: ToastOptions) => {
    const { message, type, duration = 3000 } = options;
    
    const toastElement = document.getElementById("globalToast");
    const toastBody = document.getElementById("globalToastBody");

    if (toastElement && toastBody) {
      // Configurar el contenido
      toastBody.textContent = message;
      
      // Configurar el color según el tipo
      const bgClass = {
        success: "bg-success",
        error: "bg-danger",
        info: "bg-info",
        warning: "bg-warning",
      }[type];

      toastElement.className = `toast align-items-center text-white ${bgClass} border-0`;
      
      // Configurar duración
      toastElement.setAttribute("data-bs-delay", duration.toString());

      // Mostrar el toast
      const toast = new Toast(toastElement);
      toast.show();
    }
  }, []);

  // Convenience methods
  const success = useCallback((message: string, duration?: number) => {
    showToast({ message, type: "success", duration });
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast({ message, type: "error", duration });
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast({ message, type: "info", duration });
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    showToast({ message, type: "warning", duration });
  }, [showToast]);

  return {
    showToast,
    success,
    error,
    info,
    warning,
  };
};
