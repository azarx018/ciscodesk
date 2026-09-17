import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddDevicePage.css";
import { PageHeader } from "../../components/layout";
import { Button, ErrorState, Input, Select, useToast } from "../../components/ui";
import { deviceService } from "../../services/mock/deviceService";
import { AddDeviceInput, DeviceDiscoveryResult } from "../../types/device";
import { DEVICE_GROUPS_MOCK } from "../../data/devices";
import { CONNECTION_METHODS } from "../../utils/constants";

const AUTH_METHODS = ["Password", "SSH Key", "Token"] as const;

/** Add Device flow (§6): connection-method-agnostic form + simulated Test Connection discovery. */
export function AddDevicePage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<AddDeviceInput>({
    name: "",
    hostnameOrIp: "",
    connectionMethod: "SSH",
    port: 22,
    username: "",
    authMethod: "Password",
    credential: "",
    description: "",
    group: "Access",
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<DeviceDiscoveryResult | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof AddDeviceInput>(key: K, value: AddDeviceInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleTestConnection() {
    setTesting(true);
    setTestError(null);
    setTestResult(null);
    try {
      const result = await deviceService.testConnection(form.hostnameOrIp || form.name);
      setTestResult(result);
    } catch (err) {
      setTestError((err as Error).message);
    } finally {
      setTesting(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await deviceService.add(form);
      toast.show(`${created.hostname} added to inventory (simulated).`, "success");
      navigate("/devices");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader title="Add Device" subtitle="Frontend-only — no real device is contacted" />

      <form onSubmit={handleSubmit}>
        <div className="cd-add-device-grid">
          <Input label="Device Name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="BRANCH-SW-02" />
          <Input
            label="Hostname / Management IP"
            required
            mono
            value={form.hostnameOrIp}
            onChange={(e) => update("hostnameOrIp", e.target.value)}
            placeholder="10.0.5.1"
          />
          <Select
            label="Connection Method"
            options={CONNECTION_METHODS.map((m) => ({ value: m, label: m }))}
            value={form.connectionMethod}
            onChange={(e) => update("connectionMethod", e.target.value as AddDeviceInput["connectionMethod"])}
          />
          <Input
            label="Port"
            type="number"
            value={form.port}
            onChange={(e) => update("port", Number(e.target.value))}
          />
          <Input label="Username" value={form.username} onChange={(e) => update("username", e.target.value)} placeholder="admin" />
          <Select
            label="Authentication Method"
            options={AUTH_METHODS.map((m) => ({ value: m, label: m }))}
            value={form.authMethod}
            onChange={(e) => update("authMethod", e.target.value as AddDeviceInput["authMethod"])}
          />
          <Input
            label="Credential"
            type="password"
            value={form.credential}
            onChange={(e) => update("credential", e.target.value)}
            hint="Masked — never stored or transmitted in this prototype"
          />
          <Select
            label="Device Group"
            options={DEVICE_GROUPS_MOCK.map((g) => ({ value: g, label: g }))}
            value={form.group}
            onChange={(e) => update("group", e.target.value as AddDeviceInput["group"])}
          />
          <div className="cd-add-device-full">
            <Input label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Optional" />
          </div>
        </div>

        <div className="flex gap-2" style={{ marginTop: 20 }}>
          <Button type="button" variant="default" onClick={handleTestConnection} disabled={testing || !form.hostnameOrIp}>
            {testing ? "Testing…" : "Test Connection"}
          </Button>
          <Button type="submit" variant="primary" disabled={submitting || !form.name || !form.hostnameOrIp}>
            {submitting ? "Adding…" : "Add Device"}
          </Button>
        </div>
      </form>

      {testResult && (
        <div className="cd-discovery-result">
          <div className="cd-discovery-title">Connection successful</div>
          <div className="cd-discovery-row"><span className="cd-discovery-label">Hostname</span><span className="mono">{testResult.hostname}</span></div>
          <div className="cd-discovery-row"><span className="cd-discovery-label">Platform</span><span>{testResult.platform}</span></div>
          <div className="cd-discovery-row"><span className="cd-discovery-label">Interfaces</span><span>{testResult.interfaces}</span></div>
          <div className="cd-discovery-row"><span className="cd-discovery-label">CPU</span><span>{testResult.cpu}%</span></div>
          <div className="cd-discovery-row"><span className="cd-discovery-label">Memory</span><span>{testResult.memory}%</span></div>
        </div>
      )}

      {testError && (
        <div style={{ marginTop: 20, maxWidth: 640 }}>
          <ErrorState title="Connection failed" message={testError} onRetry={handleTestConnection} />
        </div>
      )}
    </>
  );
}
