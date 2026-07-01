import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* Small laurel flourish used under several icons */
function Laurel() {
  return (
    <g opacity="0.9">
      <path d="M22 52c2 2 5 3 8 3" />
      <path d="M24 50c1 0 2 .3 3 1" />
      <path d="M26 47c1 .2 2 .8 2.6 1.6" />
      <path d="M42 52c-2 2-5 3-8 3" />
      <path d="M40 50c-1 0-2 .3-3 1" />
      <path d="M38 47c-1 .2-2 .8-2.6 1.6" />
      <circle cx="32" cy="55" r="0.9" fill="currentColor" stroke="none" />
    </g>
  );
}

/* Ornamental arch used behind several icons */
function Arch({ y = 12 }: { y?: number }) {
  return (
    <g opacity="0.7">
      <path d={`M18 ${y + 20} V${y + 6} a14 14 0 0 1 28 0 V${y + 20}`} />
      <path d={`M32 ${y - 2} l1.4 2.6 2.8.4-2 2 .5 2.8L32 ${y + 4.5} l-2.7 1.3.5-2.8-2-2 2.8-.4Z`} />
    </g>
  );
}

export function GuestsIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <Arch />
      {/* group of figures */}
      <g transform="translate(0,4)">
        <circle cx="24" cy="26" r="3" />
        <circle cx="40" cy="26" r="3" />
        <circle cx="32" cy="22" r="3.2" />
        <path d="M18 40c0-4 3-7 6-7s6 3 6 7" />
        <path d="M34 40c0-4 3-7 6-7s6 3 6 7" />
        <path d="M26 40c0-4.5 3-8 6-8s6 3.5 6 8" />
      </g>
      <Laurel />
    </svg>
  );
}

export function BedroomIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <Arch />
      {/* bed */}
      <g transform="translate(0,2)">
        {/* lampshades */}
        <path d="M14 34 l2-5 h3 l2 5 z" />
        <line x1="17.5" y1="34" x2="17.5" y2="42" />
        <path d="M45 34 l2-5 h3 l2 5 z" />
        <line x1="48.5" y1="34" x2="48.5" y2="42" />
        {/* headboard */}
        <path d="M22 38 v-6 a2 2 0 0 1 2-2 h16 a2 2 0 0 1 2 2 v6" />
        {/* mattress + pillows */}
        <rect x="20" y="38" width="24" height="6" rx="1.2" />
        <line x1="26" y1="38" x2="26" y2="41" />
        <line x1="38" y1="38" x2="38" y2="41" />
        {/* frame */}
        <path d="M18 44 h28 v4" />
        <line x1="18" y1="44" x2="18" y2="48" />
      </g>
    </svg>
  );
}

export function PoolIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* sun / arch on left */}
      <path d="M12 30 a8 8 0 0 1 16 0" opacity="0.85" />
      <line x1="20" y1="18" x2="20" y2="22" opacity="0.7" />
      {/* potted plant right */}
      <g opacity="0.9">
        <path d="M46 30 c0-4 2-7 2-10" />
        <path d="M46 30 c-2-2-4-3-6-3" />
        <path d="M46 30 c2-2 5-3 7-3" />
        <path d="M43 30 h8 l-1 6 h-6 z" />
      </g>
      {/* pool ladder */}
      <path d="M14 36 v10" />
      <path d="M18 36 v10" />
      <line x1="14" y1="39" x2="18" y2="39" />
      <line x1="14" y1="42" x2="18" y2="42" />
      {/* pool edge */}
      <path d="M10 46 h44" />
      {/* waves */}
      <path d="M12 50 q3 -2 6 0 t6 0 t6 0 t6 0 t6 0 t6 0" />
      <path d="M12 54 q3 -2 6 0 t6 0 t6 0 t6 0 t6 0 t6 0" opacity="0.7" />
    </svg>
  );
}

export function WifiIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* three wifi arcs */}
      <path d="M14 30 a24 24 0 0 1 36 0" />
      <path d="M20 36 a16 16 0 0 1 24 0" />
      <path d="M26 42 a8 8 0 0 1 12 0" />
      <circle cx="32" cy="47" r="1.6" fill="currentColor" stroke="none" />
      <Laurel />
    </svg>
  );
}

export function ParkingIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <Arch y={10} />
      {/* cypress trees */}
      <g opacity="0.85">
        <path d="M14 46 c0-6 1.5-14 3-16 c1.5 2 3 10 3 16 z" />
        <line x1="17" y1="46" x2="17" y2="50" />
        <path d="M44 46 c0-6 1.5-14 3-16 c1.5 2 3 10 3 16 z" />
        <line x1="47" y1="46" x2="47" y2="50" />
      </g>
      {/* car */}
      <g transform="translate(0,2)">
        <path d="M23 38 l2-4 h14 l2 4" />
        <path d="M22 38 h20 v6 h-2 a2.5 2.5 0 0 1-5 0 h-6 a2.5 2.5 0 0 1-5 0 h-2 z" />
        <circle cx="27" cy="44" r="1.6" />
        <circle cx="37" cy="44" r="1.6" />
        <line x1="26" y1="41" x2="30" y2="41" opacity="0.7" />
        <line x1="34" y1="41" x2="38" y2="41" opacity="0.7" />
      </g>
    </svg>
  );
}

export const HERO_HIGHLIGHT_ICONS = [
  GuestsIcon,
  BedroomIcon,
  PoolIcon,
  WifiIcon,
  ParkingIcon,
];
