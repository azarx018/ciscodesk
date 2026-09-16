# CiscoDesk

CiscoDesk is an original network-management application prototype for
Cisco infrastructure, in the spirit of tools like Winbox: direct,
practical, information-dense, fast. It does not copy Winbox or Cisco's
own UI, branding, or layouts.

## Status: frontend-only prototype (Phase 1 — Foundation)

This build contains **no real backend**. There is no SSH, NETCONF,
RESTCONF, real authentication, database, or cloud connectivity, and no
configuration change ever reaches a real device. Everything is driven
by local mock data and simulated interactions.

This build covers **Phase 1 (Foundation)** and **Phase 2 (Shell)** of
the implementation plan:

- Design tokens, typography, and the full set of reusable UI
  primitives (Phase 1) — still viewable as a living style guide at
  `/foundation` (linked from the sidebar footer).
- Real application shell (Phase 2): sidebar navigation matching the
  full nav tree, topbar with device switcher, global search / Ctrl+K
  command palette, notifications, theme toggle, and user menu. Routing
  is wired for every page in the nav — each currently renders a
  `PlaceholderPage` except `/dashboard`, which is a minimal real page
  bound to the selected device (proving the shell's device context
  reaches page content).

Phase 3 onward adds the typed mock data/services layer and replaces
each `PlaceholderPage` with the real page (Devices, Interfaces,
Switching, Routing, Security, Services, Monitoring, Topology, System,
Terminal).

## Installation

```bash
npm install
```

> This sandbox has no network access, so dependencies could not be
> installed or the build verified here. Run `npm install` locally —
> the versions pinned in `package.json` are current, stable releases,
> but do a normal `npm install` sanity check before relying on this
> build.

## Development

```bash
npm run dev       # start Vite dev server
npm run build     # type-check + production build
npm run preview   # preview the production build
```

## Mock data

Only a handful of mock devices (`src/data/devices.ts`) and mock
notifications (in `src/stores/NotificationContext.tsx`) exist so far —
just enough to make the Phase 2 shell (device switcher, command
palette, notification bell) functional. The full typed dataset for
interfaces, VLANs, routing, ACLs, logs, etc., and the mock services
that will serve it, are introduced in Phase 3.

## Project structure

```
src/
├── app/                  # Router, RootLayout (shell composition), navigation config, ThemeProvider
├── components/
│   ├── layout/           # AppShell, Sidebar, Topbar, Breadcrumbs, PageHeader,
│   │                      # CommandPalette, NotificationsPanel, UserMenu
│   ├── devices/           # DeviceSelector (topbar device switcher)
│   ├── icons/              # Hand-drawn SVG icon set (no external icon library)
│   └── ui/                # Reusable primitives (Button, Input, Select, Checkbox,
│                           # Switch, Tabs, DataTable, Modal, Drawer, Dropdown,
│                           # Tooltip, Toast, Badge, StatusIndicator, MetricCard,
│                           # EmptyState, LoadingState, ErrorState, ConfirmDialog)
├── pages/                # Dashboard (real, minimal), Foundation (style guide), Placeholder
├── stores/               # DeviceContext, NotificationContext (Phase 3 replaces with real stores/services)
├── data/                 # Mock devices (placeholder — expands in Phase 3)
├── types/                # Device type (expands in Phase 3)
├── styles/
│   ├── tokens.css         # Design tokens (color, spacing, type scale, radius)
│   └── globals.css        # Reset + typography + layout utilities
└── utils/                 # formatters, validators, constants
```

Phase 3 adds the rest of `types/`, `data/`, `services/mock/`, and
`hooks/` as described in the master specification; Phase 4 replaces
each `PlaceholderPage` with its real page.

## No real Cisco connectivity yet — future backend direction

CiscoDesk is built so the mock service layer can be replaced by a real
API later without rewriting the UI:

```
CURRENT:  Frontend → Mock Services → Mock Cisco Devices
FUTURE:   Frontend → CiscoDesk API → SSH / NETCONF / RESTCONF → Cisco Devices
```

Conceptual (not implemented) future API contracts include endpoints
such as `GET /devices`, `GET /devices/:id/interfaces`,
`POST /devices/:id/config/preview`, `POST /devices/:id/config/apply`,
and `GET /topology`.
