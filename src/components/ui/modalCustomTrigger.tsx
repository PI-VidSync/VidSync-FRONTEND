interface ModalProps {
  name: string;
  title: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  size?: "sm"|  "md" | "lg" | "xl";
}

export const ModalCustomTrigger = ({ 
  name, 
  title, 
  trigger,
  children, 
  size,
}: ModalProps) => {
  const modalSize = size ? `modal-${size}` : "";

  return (
    <>
      <div style={{ cursor: "pointer"}} data-bs-toggle="modal" data-bs-target={`#modal-${name}`}>
        {trigger}
      </div>

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
          </div>
        </div>
      </div>
    </>
  );
};