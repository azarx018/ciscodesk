import { SelectHTMLAttributes, forwardRef } from "react";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, placeholder, className, id, ...rest }, ref) => {
    const selectId = id || rest.name;
    return (
      <div className="cd-field">
        {label && (
          <label className="cd-field-label" htmlFor={selectId}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={["cd-select", error ? "cd-input-error" : "", className].filter(Boolean).join(" ")}
          aria-invalid={!!error}
          defaultValue={rest.defaultValue ?? (placeholder ? "" : undefined)}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <span className="cd-field-error">{error}</span>
        ) : hint ? (
          <span className="cd-field-hint">{hint}</span>
        ) : null}
      </div>
    );
  }
);
Select.displayName = "Select";
