import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import "./Input.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, icon, mono, className, id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className="cd-field">
        {label && (
          <label className="cd-field-label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <div className={icon ? "cd-input-wrap" : undefined}>
          {icon && <span className="cd-input-icon">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={["cd-input", mono ? "mono" : "", error ? "cd-input-error" : "", className]
              .filter(Boolean)
              .join(" ")}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...rest}
          />
        </div>
        {error ? (
          <span className="cd-field-error" id={`${inputId}-error`}>{error}</span>
        ) : hint ? (
          <span className="cd-field-hint" id={`${inputId}-hint`}>{hint}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
