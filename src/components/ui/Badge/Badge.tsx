import { HTMLAttributes, ReactNode } from "react";
import "./Badge.css";

export type BadgeTone = "online" | "warning" | "error" | "offline" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: ReactNode;
}

/**
 * Compact status/category label. `tone` should reflect real
 * device/interface/config state, not arbitrary decoration —
 * see StatusIndicator for the dot-based equivalent used in tables.
 */
export function Badge({ tone = "outline", icon, className, children, ...rest }: BadgeProps) {
  return (
    <span className={["cd-badge", `cd-badge-${tone}`, className].filter(Boolean).join(" ")} {...rest}>
      {icon}
      {children}
    </span>
  );
}
