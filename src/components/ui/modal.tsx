/**
 * Props for the modal component with a built-in trigger button.
 */
interface ModalProps {
  name: string;
  title: string;
  triggerText: string;
  children: React.ReactNode;
  loading?: boolean;
  confirmText?: string;
  danger?: boolean;
  onFinish?: () => void;
  size?: "sm"|  "md" | "lg" | "xl";
  hideFooter?: boolean;
}

/**
 * Bootstrap modal wrapper with configurable size and footer.
 * Displays a button that triggers the modal.
 */
export const Modal = ({ 
  name, 
  title,
  loading,
  triggerText, 
  confirmText, 
  children, 
  danger, 
  onFinish,
  size,
  hideFooter = false
}: ModalProps) => {
  const modalSize = size ? `modal-${size}` : "";

  return (
    <>
      <button 
        type="button" 
        className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} 
        data-bs-toggle="modal" 
        data-bs-target={`#modal-${name}`}
        disabled={loading}
      >
        {triggerText}
      </button>

      <div 
        className="modal fade" 
        id={`modal-${name}`} 
        tabIndex={-1} 
        aria-labelledby={`modalLabel-${name}`} 
        aria-hidden="true"
      >
        <div className={`modal-dialog modal-dialog-centered ${modalSize}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`modalLabel-${name}`}>
                {title}
              </h1>
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="modal" 
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
            {!hideFooter && (
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-white" 
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                {onFinish && confirmText && (
                  <button 
                    type="button" 
                    className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} 
                    onClick={onFinish}
                    data-bs-dismiss="modal"
                  >
                    {confirmText}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
