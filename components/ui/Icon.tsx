import React from "react";

const icons = {
  logo: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.1"/>
      <path d="M8 22L16 10L24 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 19H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  arrowUp: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 15V5M5 10l5-5 5 5"/>
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10h10M10 5l5 5-5 5"/>
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="10" cy="10" r="3.5"/>
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.1 4.1l1.4 1.4M14.5 14.5l1.4 1.4M4.1 15.9l1.4-1.4M14.5 5.5l1.4-1.4"/>
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M17 12A7 7 0 0 1 8 3a7 7 0 0 0 9 9z" fill="currentColor" fillOpacity="0.1"/>
      <path d="M17 12A7 7 0 0 1 8 3a7 7 0 0 0 9 9z"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 6h14M3 10h14M3 14h14"/>
    </svg>
  ),
  close: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 5l10 10M15 5L5 15"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
      <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6"/>
    </svg>
  ),
  mapPin: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
      <path d="M10 2a7 7 0 0 1 7 7c0 4.5-7 11-7 11S3 13.5 3 9a7 7 0 0 1 7-7z"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="10" cy="10" r="7"/>
      <path d="M10 6v4l2.5 2.5"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l5 5L16 6"/>
    </svg>
  ),
  x: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 5l10 10M15 5L5 15"/>
    </svg>
  ),
  loader: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.05 5.05l1.41 1.41M13.54 13.54l1.41 1.41M5.05 14.95l1.41-1.41M13.54 6.46l1.41-1.41"/>
    </svg>
  ),
  send: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3L3 9l6 3 3 6 5-15z"/>
      <path d="M9 12l4-4"/>
    </svg>
  ),
  image: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="16" height="16" rx="2"/>
      <circle cx="7.5" cy="7.5" r="1.5"/>
      <path d="M2 13.5l4-4 3 3 2-2 5 5"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l7 3v5c0 4-3.5 7-7 8-3.5-1-7-4-7-8V5l7-3z"/>
    </svg>
  ),
  building: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18V7l7-5 7 5v11"/>
      <path d="M8 18v-5h4v5"/>
      <path d="M3 18h14"/>
    </svg>
  ),
  trendingUp: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14l5-5 4 3 7-7"/>
      <path d="M13 5h5v5"/>
    </svg>
  ),
  file: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6l-4-4z"/>
      <path d="M12 2v4h4"/>
      <path d="M8 12h4M8 9h2"/>
    </svg>
  ),
  road: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M7 18L5 2"/>
      <path d="M13 18L15 2"/>
      <path d="M5 10h10"/>
      <path d="M5.5 6h9M6 14h8"/>
    </svg>
  ),
  home: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L10 3l7 7.5"/>
      <path d="M5 8.5V17h3.5v-4h3V17H15V8.5"/>
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2s-7 0-10 7c-1 2.5-1 5 0 7"/>
      <path d="M3 16c2-4 5-7 9-9"/>
    </svg>
  ),
  book: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4a1 1 0 0 1 1-1h5v14H4a1 1 0 0 1-1-1V4z"/>
      <path d="M9 3h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9"/>
      <path d="M9 7h6M9 10h4"/>
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="5" height="5" rx="1"/>
      <rect x="12" y="3" width="5" height="5" rx="1"/>
      <rect x="3" y="12" width="5" height="5" rx="1"/>
      <rect x="12" y="12" width="5" height="5" rx="1"/>
    </svg>
  ),
  logOut: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3h4v14h-4"/>
      <path d="M9 14l4-4-4-4"/>
      <path d="M3 10h10"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="9" cy="9" r="5.5"/>
      <path d="M13.5 13.5L17 17"/>
    </svg>
  ),
  chevronsDown: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7l5 5 5-5M5 11l5 5 5-5"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M10 4v12M4 10h12"/>
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3l3 3L7 16H4v-3L14 3z"/>
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/>
      <circle cx="10" cy="10" r="2.5"/>
    </svg>
  ),
  share: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
      <path d="M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
      <path d="M14 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
      <path d="M8.7 10.7l2.6 1.6M11.3 7.7L8.7 9.3"/>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="14" height="14" rx="2"/>
      <path d="M3 8h14M7 2v4M13 2v4"/>
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10V3h7l8 8-7 7-8-8z"/>
      <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M10 2L2 17h16L10 2z"/>
      <path d="M10 8v4M10 14.5v.5"/>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="10" cy="10" r="7.5"/>
      <path d="M10 9v5M10 7v.5"/>
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 5l6 5-6 5"/>
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 13v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3"/>
      <path d="M10 12V3"/>
      <path d="M6 7l4-4 4 4"/>
    </svg>
  ),
  save: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2h9l4 4v12H3V2h1z"/>
      <path d="M8 2v5h6"/>
      <path d="M6 13h8v5H6z"/>
    </svg>
  ),
  filter: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h14M6 10h8M9 15h2"/>
    </svg>
  ),
};

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 16, className = "", style }: IconProps) {
  return (
    <span
      className={`icon ${className}`}
      style={{ display: "inline-flex", width: size, height: size, flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {icons[name]}
    </span>
  );
}
