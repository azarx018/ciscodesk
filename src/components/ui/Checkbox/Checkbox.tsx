import { InputHTMLAttributes, forwardRef } from "react";
import "./Checkbox.css";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className, ...rest }, ref) => {
    const checkboxId = id || rest.name;
    return (
      <label className="cd-checkbox" htmlFor={checkboxId}>
        <input ref={ref} type="checkbox" id={checkboxId} className={className} {...rest} />
        <span className="cd-checkbox-box" aria-hidden="true" />
        {label && <span className="cd-checkbox-label">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
