import { ReactNode } from "react";
import "./PageHeader.css";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/** Consistent title + contextual actions row at the top of every page. */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="cd-page-header">
      <div>
        <div className="cd-page-title">{title}</div>
        {subtitle && <div className="cd-page-subtitle">{subtitle}</div>}
      </div>
      {actions && <div className="cd-page-actions">{actions}</div>}
    </div>
  );
}
