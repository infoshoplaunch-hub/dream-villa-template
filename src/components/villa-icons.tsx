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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path fill="currentColor" d="M8 2.002a1.998 1.998 0 1 0 0 3.996a1.998 1.998 0 0 0 0-3.996M12.5 3a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m-9 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M5 7.993A1 1 0 0 1 6 7h4a1 1 0 0 1 1 1v3a3 3 0 0 1-.146.927A3.001 3.001 0 0 1 5 11zM4 8c0-.365.097-.706.268-1H2a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 0 3.436 2.319A4 4 0 0 1 4 10.999zm8 0v3c0 .655-.157 1.273-.436 1.819A2.5 2.5 0 0 0 15 10.5V8a1 1 0 0 0-1-1h-2.268c.17.294.268.635.268 1" />
    </svg>
  );
}

export function BedroomIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path fill="none" stroke="currentColor" strokeWidth="1" d="M1.5 18.5V14l.676-.184a37.34 37.34 0 0 1 19.648 0L22.5 14v4.5m-21 0s0 3-1.5 3m1.5-3h21m0 0s0 3 1.5 3M3.5 11c0-1.989-.297-3.966-.882-5.867L2.5 4.75V4.5h19v.25l-.118.383A20 20 0 0 0 20.5 11M12 7.5H6.5V11M12 7.5V11m0-3.5h5.5V11" />
    </svg>
  );
}

export function PoolIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M2 21v-2q.95 0 1.425-.5T5.3 18t1.925.5t1.425.5t1.425-.5T12 18t1.925.5t1.425.5t1.425-.5T18.7 18t1.875.5T22 19v2q-1.475 0-1.937-.5T18.7 20t-1.425.5t-1.925.5t-1.925-.5T12 20t-1.425.5t-1.925.5t-1.925-.5T5.3 20t-1.363.5T2 21m0-4.5v-2q.95 0 1.425-.5t1.875-.5t1.938.5t1.412.5q.9 0 1.425-.5T12 13.5t1.925.5t1.425.5t1.425-.5t1.925-.5t1.875.5t1.425.5v2q-1.475 0-1.937-.5t-1.363-.5t-1.388.5t-1.962.5q-1.425 0-1.937-.5T12 15.5q-.95 0-1.412.5t-1.938.5t-1.963-.5t-1.387-.5t-1.362.5T2 16.5m4.9-5.1l3.325-3.325l-1-1q-.825-.825-1.75-1.2T5.2 5.5V3q1.875 0 3.1.413T10.7 5l6.4 6.4q-.425.275-.825.438T15.35 12q-.9 0-1.425-.5T12 11t-1.925.5t-1.425.5q-.525 0-.925-.162T6.9 11.4m11.575-7.663q.725.738.725 1.763q0 1.05-.725 1.775T16.7 8t-1.775-.725T14.2 5.5q0-1.025.725-1.763T16.7 3t1.775.738" />
    </svg>
  );
}

export function WifiIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.75 8.988A12.068 12.068 0 0 1 21.25 9" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.64 11.964a8.297 8.297 0 0 1 12.72.01m-9.805 3.029a4.495 4.495 0 0 1 6.89.005" />
        <circle cx="12" cy="17.878" r="1.445" fill="currentColor" />
      </g>
    </svg>
  );
}

export function ParkingIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M13.2 11H10V7h3.2a2 2 0 0 1 2 2a2 2 0 0 1-2 2M13 3H6v18h4v-6h3a6 6 0 0 0 6-6c0-3.32-2.69-6-6-6" />
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
