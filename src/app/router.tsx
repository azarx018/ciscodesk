import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { PlaceholderPage } from "../pages/Placeholder/PlaceholderPage";
import { FoundationPage } from "../pages/Foundation/FoundationPage";
import { FLAT_NAV } from "./navigation";

/**
 * One route per NAV entry (§3), each rendering PlaceholderPage until
 * its real page is built in Phase 4 — Dashboard is the only page with
 * real (if minimal) content so far, to prove the shell wiring works.
 * `/foundation` is an unlisted reference route for the Phase 1 style
 * guide, reachable via the sidebar footer link.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/foundation", element: <FoundationPage /> },
      ...FLAT_NAV.filter((e) => e.path !== "/dashboard").map((entry) => ({
        path: entry.path,
        element: <PlaceholderPage title={entry.label} />,
      })),
      { path: "*", element: <PlaceholderPage title="Not found" /> },
    ],
  },
]);
