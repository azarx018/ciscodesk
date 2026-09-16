import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { NAV } from "../../../app/navigation";
import { Icon } from "../../icons/Icon";
import "./Sidebar.css";

export interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function groupContainsPath(groupChildren: { path: string }[] | undefined, pathname: string): boolean {
  return !!groupChildren?.some((c) => c.path === pathname);
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV.forEach((g) => {
      if (g.children) initial[g.id] = groupContainsPath(g.children, location.pathname);
    });
    return initial;
  });

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      {mobileOpen && <div className="cd-sidebar-scrim" onClick={onCloseMobile} />}
      <aside className={["cd-sidebar", mobileOpen ? "cd-sidebar-open" : ""].join(" ")}>
        <div className="cd-sidebar-brand">
          <span className="cd-brand-word">
            CISCO<span className="dim">DESK</span>
          </span>
        </div>
        <nav className="cd-sidebar-nav">
          {NAV.map((group) => {
            const GroupIcon = Icon[group.icon];
            if (!group.children) {
              return (
                <NavLink
                  key={group.id}
                  to={group.path!}
                  className={({ isActive }) => ["cd-nav-link", "cd-nav-top", isActive ? "cd-nav-active" : ""].filter(Boolean).join(" ")}
                >
                  <span className="cd-nav-icon"><GroupIcon size={15} /></span>
                  {group.label}
                </NavLink>
              );
            }
            const isOpen = !!openGroups[group.id];
            return (
              <div className="cd-nav-group" key={group.id}>
                <button
                  className="cd-nav-group-label"
                  data-open={isOpen}
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2">
                    <span className="cd-nav-icon"><GroupIcon size={15} /></span>
                    {group.label}
                  </span>
                  <span className="cd-nav-chev"><Icon.chevronRight size={13} /></span>
                </button>
                {isOpen && (
                  <div className="cd-nav-children">
                    {group.children.map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={({ isActive }) => ["cd-nav-link", isActive ? "cd-nav-active" : ""].filter(Boolean).join(" ")}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="cd-sidebar-footer">
          <NavLink to="/foundation" className="cd-sidebar-footer-link">
            Style guide
          </NavLink>
        </div>
      </aside>
    </>
  );
}
