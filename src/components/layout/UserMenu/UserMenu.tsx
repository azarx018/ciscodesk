import { Dropdown } from "../../ui";
import { Icon } from "../../icons/Icon";
import "./UserMenu.css";

/** Session/user menu. RBAC roles (Administrator/Operator/Viewer) are managed in System > Users (Phase 4). */
export function UserMenu() {
  return (
    <Dropdown
      align="right"
      trigger={
        <button className="cd-user-trigger" aria-label="User menu">
          <span className="cd-user-avatar">
            <Icon.user size={14} />
          </span>
        </button>
      }
      items={[
        { id: "profile", label: "admin · Administrator", onSelect: () => {}, disabled: true },
        { id: "users", label: "Manage users", onSelect: () => {} },
        { id: "signout", label: "Sign out", onSelect: () => {} },
      ]}
    />
  );
}
