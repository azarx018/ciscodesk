import { InputHTMLAttributes, forwardRef } from "react";
import "./Switch.css";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, id, className, ...rest }, ref) => {
    const switchId = id || rest.name;
    return (
      <label className="cd-switch" htmlFor={switchId}>
        <input ref={ref} type="checkbox" role="switch" id={switchId} className={className} {...rest} />
        <span className="cd-switch-track" aria-hidden="true">
          <span className="cd-switch-thumb" />
        </span>
        {label && <span className="cd-switch-label">{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";
