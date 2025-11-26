import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  icon?: React.ReactNode;
  register: UseFormRegisterReturn;
  endIcon?: {
    icon: React.ReactNode;
    onClick?: () => void;
    inactiveIcon?: React.ReactNode;
    isActive?: boolean;
  };
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  placeholder,
  error,
  icon,
  register,
  endIcon,
}) => {
  return (
    <div className="input-container">
      <div className="input-group">
        {icon && <span className="input-group-text">{icon}</span>}
        <div className="form-floating">
          <input
            {...register}
            className={`form-control ${error ? "is-invalid" : ""}`}
            type={type}
            placeholder={placeholder || label}
          />
          <label>{label}</label>
        </div>
        {endIcon && <button className="btn btn-input" type="button" onClick={endIcon.onClick}>{endIcon.isActive !== false ? endIcon.icon : endIcon.inactiveIcon}</button>}
      </div>
      {error && <div className="error">{error.message}</div>}
    </div>
  );
};