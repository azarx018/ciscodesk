import { ReactNode } from "react";
import "./EmptyState.css";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="cd-empty">
      {icon && <div className="cd-empty-icon">{icon}</div>}
      <div className="cd-empty-title">{title}</div>
      {body && <div className="cd-empty-body">{body}</div>}
      {action && <div className="cd-empty-action">{action}</div>}
    </div>
  );
}
