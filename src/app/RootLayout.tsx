import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppShell, Breadcrumbs, Sidebar, Topbar, CommandPalette } from "../components/layout";
import { crumbsForPath } from "./navigation";

/**
 * Assembles the Phase 2 shell (sidebar, topbar, breadcrumbs, command
 * palette) around whatever page the router renders into `<Outlet />`.
 */
export function RootLayout() {
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <>
      <AppShell
        sidebar={<Sidebar mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />}
        topbar={
          <Topbar
            onOpenPalette={() => setPaletteOpen(true)}
            onToggleMobileSidebar={() => setMobileSidebarOpen((o) => !o)}
          />
        }
        breadcrumbs={<Breadcrumbs items={crumbsForPath(location.pathname)} />}
      >
        <Outlet />
      </AppShell>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
