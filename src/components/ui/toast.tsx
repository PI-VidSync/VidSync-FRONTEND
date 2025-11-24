import React from "react";

export const ToastContainer: React.FC = () => {
  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      <div
        id="globalToast"
        className="toast align-items-center text-white bg-primary border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-bs-autohide="true"
        data-bs-delay="3000"
      >
        <div className="d-flex">
          <div className="toast-body" id="globalToastBody">
            Mensaje de notificación
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
};