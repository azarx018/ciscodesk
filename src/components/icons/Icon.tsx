import { ReactNode, SVGProps } from "react";

interface IconBaseProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function Base({ size = 16, children, ...rest }: IconBaseProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

/**
 * Minimal, purpose-drawn icon set (no external icon library) so the
 * visual language stays consistent with the rest of the design
 * system. Each icon maps 1:1 to a nav section or shell control.
 */
export const Icon = {
  grid: (p: IconBaseProps) => (
    <Base {...p}>
      <rect x="3" y="3" width="6" height="6" rx="0.5" />
      <rect x="11" y="3" width="6" height="6" rx="0.5" />
      <rect x="3" y="11" width="6" height="6" rx="0.5" />
      <rect x="11" y="11" width="6" height="6" rx="0.5" />
    </Base>
  ),
  layers: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M10 2.5l7 3.5-7 3.5-7-3.5 7-3.5z" />
      <path d="M3 10l7 3.5 7-3.5" />
      <path d="M3 13.5l7 3.5 7-3.5" />
    </Base>
  ),
  plug: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M6 3v4M10 3v4" />
      <rect x="4" y="7" width="8" height="5" rx="0.5" />
      <path d="M8 12v2a3 3 0 0 0 3 3h2" />
      <path d="M15 17v2" />
    </Base>
  ),
  switch: (p: IconBaseProps) => (
    <Base {...p}>
      <rect x="3" y="4" width="14" height="4" rx="0.5" />
      <rect x="3" y="12" width="14" height="4" rx="0.5" />
      <circle cx="6" cy="6" r="0.6" fill="currentColor" />
      <circle cx="6" cy="14" r="0.6" fill="currentColor" />
    </Base>
  ),
  route: (p: IconBaseProps) => (
    <Base {...p}>
      <circle cx="4.5" cy="15.5" r="1.6" />
      <circle cx="15.5" cy="4.5" r="1.6" />
      <path d="M4.5 13.9V9a4 4 0 0 1 4-4H11" />
      <path d="M13 3l2.5 1.5L13 6" />
    </Base>
  ),
  shield: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M10 2.5l6 2.2v4.6c0 4-2.6 6.7-6 8.2-3.4-1.5-6-4.2-6-8.2V4.7l6-2.2z" />
    </Base>
  ),
  server: (p: IconBaseProps) => (
    <Base {...p}>
      <rect x="3" y="3.5" width="14" height="5" rx="0.6" />
      <rect x="3" y="11.5" width="14" height="5" rx="0.6" />
      <circle cx="6" cy="6" r="0.6" fill="currentColor" />
      <circle cx="6" cy="14" r="0.6" fill="currentColor" />
    </Base>
  ),
  activity: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M2.5 10.5h3l2-5.5 3 11 2-9 1.5 3.5h3.5" />
    </Base>
  ),
  topology: (p: IconBaseProps) => (
    <Base {...p}>
      <circle cx="10" cy="4" r="1.8" />
      <circle cx="4" cy="16" r="1.8" />
      <circle cx="16" cy="16" r="1.8" />
      <path d="M8.8 5.6L5.2 14.4M11.2 5.6l3.6 8.8M5.8 16h8.4" />
    </Base>
  ),
  cog: (p: IconBaseProps) => (
    <Base {...p}>
      <circle cx="10" cy="10" r="2.6" />
      <path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.1 5.1l1.4 1.4M13.5 13.5l1.4 1.4M14.9 5.1l-1.4 1.4M6.5 13.5l-1.4 1.4" />
    </Base>
  ),
  terminal: (p: IconBaseProps) => (
    <Base {...p}>
      <rect x="2.5" y="3.5" width="15" height="13" rx="0.8" />
      <path d="M5.5 8l2.5 2.5L5.5 13M10.5 13h4" />
    </Base>
  ),
  search: (p: IconBaseProps) => (
    <Base {...p}>
      <circle cx="8.6" cy="8.6" r="5.1" />
      <path d="M16 16l-3.2-3.2" />
    </Base>
  ),
  bell: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M5 8.5a5 5 0 0 1 10 0c0 3.5 1.2 4.6 1.2 4.6H3.8S5 12 5 8.5z" />
      <path d="M8.3 15.5a1.8 1.8 0 0 0 3.4 0" />
    </Base>
  ),
  sun: (p: IconBaseProps) => (
    <Base {...p}>
      <circle cx="10" cy="10" r="3.4" />
      <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M14 6l1.4-1.4M4.6 15.4L6 14" />
    </Base>
  ),
  moon: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M15.5 11.8A6.3 6.3 0 0 1 8.2 4.5a6.3 6.3 0 1 0 7.3 7.3z" />
    </Base>
  ),
  chevronRight: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M7.5 4.5l5 5.5-5 5.5" />
    </Base>
  ),
  chevronDown: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M4.5 7.5l5.5 5 5.5-5" />
    </Base>
  ),
  menu: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M3 5.5h14M3 10h14M3 14.5h14" />
    </Base>
  ),
  x: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M5 5l10 10M15 5L5 15" />
    </Base>
  ),
  cpu: (p: IconBaseProps) => (
    <Base {...p}>
      <rect x="6" y="6" width="8" height="8" rx="0.5" />
      <rect x="8.5" y="2.5" width="3" height="3" />
      <rect x="8.5" y="14.5" width="3" height="3" />
      <rect x="2.5" y="8.5" width="3" height="3" />
      <rect x="14.5" y="8.5" width="3" height="3" />
    </Base>
  ),
  clock: (p: IconBaseProps) => (
    <Base {...p}>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 6.5V10l3 1.8" />
    </Base>
  ),
  alertTri: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M10 3.5l7.2 12.5H2.8L10 3.5z" />
      <path d="M10 8.5v3.2" />
      <circle cx="10" cy="13.8" r="0.5" fill="currentColor" />
    </Base>
  ),
  info: (p: IconBaseProps) => (
    <Base {...p}>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 9v4.2" />
      <circle cx="10" cy="6.7" r="0.5" fill="currentColor" />
    </Base>
  ),
  check: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M4 10.5l3.6 3.6L16 5.5" />
    </Base>
  ),
  history: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M3.5 10a6.5 6.5 0 1 0 2-4.7" />
      <path d="M3.5 3.5v3h3M10 6.5V10l2.6 1.5" />
    </Base>
  ),
  arrowRight: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M4 10h11M10.5 5.5L15 10l-4.5 4.5" />
    </Base>
  ),
  user: (p: IconBaseProps) => (
    <Base {...p}>
      <circle cx="10" cy="7" r="3" />
      <path d="M3.5 17c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
    </Base>
  ),
  command: (p: IconBaseProps) => (
    <Base {...p}>
      <path d="M7 4a2 2 0 1 0-2 2h10a2 2 0 1 0-2-2v12a2 2 0 1 0 2-2H5a2 2 0 1 0 2 2z" />
    </Base>
  ),
};
export type IconName = keyof typeof Icon;
