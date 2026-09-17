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

**Phase 3 (Data Architecture)** is also done: full TypeScript models
for every entity in §21, mock data for all five devices that stays
internally consistent (VLANs referenced by interfaces/MAC table/STP,
OSPF/BGP neighbors matching the topology, logs/backups/firmware per
device), and mock services for every domain — all going through
`simulateRequest` so every call is a real `Promise` with latency,
exactly like a future real API call. `DeviceContext` and the new
`useDevices`/`useInterfaces` hooks read through the service layer
rather than importing mock data directly, so pages never touch
`data/*` themselves.

**Phase 4 (Pages)** is done — every nav destination in §3 now has a
real page wired to its mock service, replacing `PlaceholderPage`:

- **Dashboard** — full §7: device metrics, interface overview,
  aggregate traffic, alerts derived from live mock state, recent
  activity from the device's logs.
- **Devices** — All Devices (search/sort/select/bulk-delete), Device
  Groups, Add Device (form + simulated Test Connection discovery).
- **Interfaces** — list + detail with Overview/Configuration/Traffic/
  Errors/Logs tabs and the Edit → Preview → Confirm → Apply safety
  flow for configuration changes (§8, §29).
- **Switching** — VLANs (create/delete), MAC Address Table (filters),
  STP (per-VLAN role/state/cost).
- **Routing** — Routing Table, Static Routes (add/delete), OSPF, BGP.
- **Security** — ACL (rule editor + generated config preview per
  §11/§29), NAT, Port Security.
- **Services** — DHCP, DNS, NTP, SNMP.
- **Monitoring** — Traffic (per-interface, with an interface picker),
  CPU/Memory (current/average/peak + history bars), Logs (severity
  filter), Health.
- **Topology** — a real SVG node/link canvas built from the mock
  device/link data, with clickable nodes (§14).
- **System** — Device Information, Users (mock RBAC), Configuration
  (Running/Startup/Diff/History tabs), Backups (create/restore/
  download/delete), Firmware.
- **Terminal** — a Cisco CLI mock with history (↑/↓), clear, copy,
  and command suggestions (§16); never executes a real command.

Phase 5 (deeper interaction polish across pages) and Phase 6
(spacing/accessibility/responsive polish pass) are next.

## Known-issue fixes since Phase 4

- **Mobile topbar overflow** — the device switcher had a fixed
  `min-width` that overflowed narrow phone screens, making the whole
  page horizontally scrollable. Fixed: topbar controls now shrink and
  hide secondary text below 1024px/640px, and the shell has an
  `overflow-x: hidden` safety net.
- **Topology → Device Information showed the wrong device** —
  clicking a node's "View device information" button navigated
  without updating the globally selected device, so the page still
  showed whichever device was selected in the topbar. Fixed: it now
  switches the selected device to the clicked node first.
- **Interface detail breadcrumb showed "Not found"** — breadcrumbs
  only matched static nav paths, and `/interfaces/:interfaceId` is
  dynamic. Fixed: breadcrumb resolution now falls back to the closest
  parent nav entry for dynamic child routes.
- **Missing `src/vite-env.d.ts`** — without it, `tsc -b` (the build
  script's type-check step) fails to resolve `.css` imports even
  after a normal `npm install`. Added.

## Phase 6 (Polish) — in progress

- Removed CSS duplicated across page-level stylesheets now that
  shared patterns (`cd-panel`, `cd-stat-row`, `cd-toolbar`, activity/
  alert lists) live once in `styles/globals.css`.
- Sortable table headers are now real `<button>`s (keyboard-operable,
  `aria-sort` reflects current sort) instead of a `<th onClick>`.
- The table "select all" checkbox shows an indeterminate state for
  partial selections.
- Escape now closes the device switcher, notifications panel, and
  generic dropdown menu (previously only Modal/Drawer/Command
  Palette handled it).
- Disabled form controls (`Button`, `Input`, `Select`) now show
  `cursor: not-allowed` consistently.
- **Destructive-action gap fixed**: VLAN delete and ACL rule delete
  used to run immediately on click, with no confirmation — every
  other delete in the app goes through `ConfirmDialog`. Both now do
  too, and Backup **Restore** (overwrites the running config) is now
  confirmed as well, matching §27's "protect destructive actions with
  confirmation" and "make configuration changes explicit".
- **Sidebar section highlighting fixed**: the sidebar lives in the
  persistent shell, not per-page, so its expand/collapse state used
  to be computed once at first load. Navigating to a nested page via
  the command palette or a breadcrumb (rather than clicking through
  the sidebar itself) left the owning section collapsed even though
  that page was active. The sidebar now re-derives which section to
  expand on every route change.

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
├── pages/                # One folder per nav section — Dashboard, Devices, Interfaces,
│                          # Switching, Routing, Security, Services, Monitoring, Topology,
│                          # System, Terminal — plus Foundation (style guide) and Placeholder
├── stores/               # DeviceContext, NotificationContext — read through services/mock, not data/ directly
├── hooks/                # useAsync (generic), useDevices, useInterfaces, useNotifications
├── services/mock/        # deviceService, interfaceService, switchingService, routingService,
│                          # securityService, networkServicesService, monitoringService,
│                          # topologyService, userService, systemService — all async via mockClient
├── data/                 # Typed, cross-referential mock data for all 5 devices (§23)
├── types/                # Full model set from §21 (device, interface, vlan, routing, security,
│                          # service, monitoring, topology, user, system, notification)
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
