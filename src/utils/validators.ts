/** Shared form validators for device/config forms (Add Device, Static Routes, ACL editor, etc). */

const IPV4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

export function isValidIPv4(value: string): boolean {
  const match = value.match(IPV4_RE);
  if (!match) return false;
  return match.slice(1).every((octet) => Number(octet) >= 0 && Number(octet) <= 255);
}

export function isValidHostname(value: string): boolean {
  return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    value
  );
}

export function isValidPort(value: string | number): boolean {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 65535;
}

export function isRequired(value: string | undefined | null): boolean {
  return !!value && value.trim().length > 0;
}
