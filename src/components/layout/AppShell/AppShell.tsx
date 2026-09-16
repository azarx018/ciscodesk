import { ReactNode } from "react";
import "./AppShell.css";

export interface AppShellProps {
  sidebar: ReactNode;
  topbar: ReactNode;
  breadcrumbs?: ReactNode;
  children: ReactNode;
}

/**
 * Structural frame for the whole application: fixed-height sidebar +
 * topbar, scrollable content column. Phase 2 fills `sidebar`/`topbar`
 * with the real navigation and device-context controls; this shell
 * only owns the layout geometry so that work can drop in cleanly.
 */
export function AppShell({ sidebar, topbar, breadcrumbs, children }: AppShellProps) {
  return (
    <div className="cd-shell">
      <div className="cd-shell-body">
        {sidebar}
        <div className="cd-shell-workspace">
          {topbar}
          {breadcrumbs}
          <div className="cd-shell-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
