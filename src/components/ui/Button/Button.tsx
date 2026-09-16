import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import "./Button.css";

export type ButtonVariant = "default" | "primary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconTrailing?: ReactNode;
}

/**
 * Base action control. Variants map directly to intent:
 * - default: neutral action
 * - primary: the one recommended action in a view
 * - danger: destructive action (still requires confirmation upstream)
 * - ghost: low-emphasis / toolbar action
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "md", icon, iconTrailing, className, children, ...rest }, ref) => {
    const classes = ["cd-btn", `cd-btn-${variant}`, size === "sm" ? "cd-btn-sm" : "", className]
      .filter(Boolean)
      .join(" ");
    return (
      <button ref={ref} className={classes} {...rest}>
        {icon}
        {children}
        {iconTrailing}
      </button>
    );
  }
);
Button.displayName = "Button";
