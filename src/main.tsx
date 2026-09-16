import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { DeviceProvider } from "./stores/DeviceContext";
import { NotificationProvider } from "./stores/NotificationContext";
import { ToastProvider } from "./components/ui";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DeviceProvider>
        <NotificationProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </NotificationProvider>
      </DeviceProvider>
    </ThemeProvider>
  </StrictMode>
);
