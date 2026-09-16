import { ReactNode, useState } from "react";
import "./Tabs.css";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (id: string) => void;
}

/**
 * Controlled or uncontrolled tab set. Used for record-detail views
 * (e.g. Interface Detail: Overview / Configuration / Traffic / Errors / Logs).
 */
export function Tabs({ tabs, defaultTab, activeTab, onChange }: TabsProps) {
  const [internal, setInternal] = useState(defaultTab || tabs[0]?.id);
  const current = activeTab ?? internal;

  function select(id: string) {
    setInternal(id);
    onChange?.(id);
  }

  const active = tabs.find((t) => t.id === current) || tabs[0];

  return (
    <div className="cd-tabs">
      <div className="cd-tabs-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={tab.id === current}
            disabled={tab.disabled}
            className={["cd-tab", tab.id === current ? "cd-tab-active" : ""].filter(Boolean).join(" ")}
            onClick={() => select(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="cd-tabs-panel" role="tabpanel">
        {active?.content}
      </div>
    </div>
  );
}
