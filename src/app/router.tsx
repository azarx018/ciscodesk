import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { FoundationPage } from "../pages/Foundation/FoundationPage";
import { PlaceholderPage } from "../pages/Placeholder/PlaceholderPage";

import { AllDevicesPage } from "../pages/Devices/AllDevicesPage";
import { DeviceGroupsPage } from "../pages/Devices/DeviceGroupsPage";
import { AddDevicePage } from "../pages/Devices/AddDevicePage";

import { InterfacesPage } from "../pages/Interfaces/InterfacesPage";
import { InterfaceDetailPage } from "../pages/Interfaces/InterfaceDetailPage";

import { VlansPage } from "../pages/Switching/VlansPage";
import { MacTablePage } from "../pages/Switching/MacTablePage";
import { StpPage } from "../pages/Switching/StpPage";

import { RoutingTablePage } from "../pages/Routing/RoutingTablePage";
import { StaticRoutesPage } from "../pages/Routing/StaticRoutesPage";
import { OspfPage } from "../pages/Routing/OspfPage";
import { BgpPage } from "../pages/Routing/BgpPage";

import { AclPage } from "../pages/Security/AclPage";
import { NatPage } from "../pages/Security/NatPage";
import { PortSecurityPage } from "../pages/Security/PortSecurityPage";

import { DhcpPage } from "../pages/Services/DhcpPage";
import { DnsPage } from "../pages/Services/DnsPage";
import { NtpPage } from "../pages/Services/NtpPage";
import { SnmpPage } from "../pages/Services/SnmpPage";

import { TrafficPage } from "../pages/Monitoring/TrafficPage";
import { CpuMemoryPage } from "../pages/Monitoring/CpuMemoryPage";
import { LogsPage } from "../pages/Monitoring/LogsPage";
import { HealthPage } from "../pages/Monitoring/HealthPage";

import { TopologyPage } from "../pages/Topology/TopologyPage";

import { DeviceInfoPage } from "../pages/System/DeviceInfoPage";
import { UsersPage } from "../pages/System/UsersPage";
import { ConfigurationPage } from "../pages/System/ConfigurationPage";
import { BackupsPage } from "../pages/System/BackupsPage";
import { FirmwarePage } from "../pages/System/FirmwarePage";

import { TerminalPage } from "../pages/Terminal/TerminalPage";

/**
 * Every NAV entry (§3) now has its real Phase 4 page. `/foundation`
 * remains an unlisted reference route for the Phase 1 style guide.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/foundation", element: <FoundationPage /> },

      { path: "/devices", element: <AllDevicesPage /> },
      { path: "/devices/groups", element: <DeviceGroupsPage /> },
      { path: "/devices/add", element: <AddDevicePage /> },

      { path: "/interfaces", element: <InterfacesPage /> },
      { path: "/interfaces/:interfaceId", element: <InterfaceDetailPage /> },

      { path: "/switching/vlans", element: <VlansPage /> },
      { path: "/switching/mac-table", element: <MacTablePage /> },
      { path: "/switching/stp", element: <StpPage /> },

      { path: "/routing/table", element: <RoutingTablePage /> },
      { path: "/routing/static", element: <StaticRoutesPage /> },
      { path: "/routing/ospf", element: <OspfPage /> },
      { path: "/routing/bgp", element: <BgpPage /> },

      { path: "/security/acl", element: <AclPage /> },
      { path: "/security/nat", element: <NatPage /> },
      { path: "/security/port-security", element: <PortSecurityPage /> },

      { path: "/services/dhcp", element: <DhcpPage /> },
      { path: "/services/dns", element: <DnsPage /> },
      { path: "/services/ntp", element: <NtpPage /> },
      { path: "/services/snmp", element: <SnmpPage /> },

      { path: "/monitoring/traffic", element: <TrafficPage /> },
      { path: "/monitoring/cpu-memory", element: <CpuMemoryPage /> },
      { path: "/monitoring/logs", element: <LogsPage /> },
      { path: "/monitoring/health", element: <HealthPage /> },

      { path: "/topology", element: <TopologyPage /> },

      { path: "/system/device-info", element: <DeviceInfoPage /> },
      { path: "/system/users", element: <UsersPage /> },
      { path: "/system/configuration", element: <ConfigurationPage /> },
      { path: "/system/backups", element: <BackupsPage /> },
      { path: "/system/firmware", element: <FirmwarePage /> },

      { path: "/terminal", element: <TerminalPage /> },

      { path: "*", element: <PlaceholderPage title="Not found" /> },
    ],
  },
]);
