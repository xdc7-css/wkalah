import { LucideProps } from "lucide-react";

/**
 * Custom Realistic Ration Icons
 * Designed to strictly match the Lucide 1.5px outline style
 */

const SackIcon = ({ size = 24, strokeWidth = 1.5, ...props }: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 21l-.5-11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2l-.5 11" />
    <path d="M5 21h14" />
    <path d="M9 8c0-3 1.5-5 3-5s3 2 3 5" />
    <path d="M8 8s1-1.5 4-1.5 4 1.5 4 1.5" />
  </svg>
);

const RiceSackIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? 24}
    height={props.size ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 21l-.5-11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2l-.5 11" />
    <path d="M5 21h14" />
    <path d="M9 8c0-3 1.5-5 3-5s3 2 3 5" />
    <path d="M9 13l2 2 4-4" /> {/* Tick or grain mark */}
  </svg>
);

const FlourSackIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? 24}
    height={props.size ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 21l-.5-11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2l-.5 11" />
    <path d="M5 21h14" />
    <path d="M9 8c0-3 1.5-5 3-5s3 2 3 5" />
    <path d="M12 11v6M10 13l2-2 2 2" /> {/* Grain/wheat spike simplified */}
  </svg>
);

const OilBottleIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? 24}
    height={props.size ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 21h6l1-12h-8l1 12ZM10 9v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4M12 12c0 1.5-1 2.5-1 2.5s1 1 1 1M12 12c0 1.5 1 2.5 1 2.5s-1 1-1 1" /> {/* Drop mark on bottle */}
    <path d="M9 12h6" /> {/* label area */}
  </svg>
);

const TinCanIcon = (props: LucideProps & { variant?: 'small' | 'big' }) => {
  const height = props.variant === 'small' ? 8 : props.variant === 'big' ? 14 : 11;
  const y = props.variant === 'small' ? 10 : props.variant === 'big' ? 4 : 7;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth ?? 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <ellipse cx="12" cy={y} rx="6" ry="2.5" />
      <path d={`M6 ${y}v${height}c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-${height}`} />
      <ellipse cx="12" cy={y + height} rx="6" ry="2.5" />
      {props.variant === 'big' && <path d="M6 8.5h12M6 13.5h12" />} {/* Detail rings for big can */}
    </svg>
  );
};

const BeansIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? 24}
    height={props.size ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 10c-1-1-2-.5-2 1.5s1 2.5 2 1.5a1 1 0 0 0 0-1.5Z" />
    <path d="M12 14c-1-1-2-.5-2 1.5s1 2.5 2 1.5a1 1 0 0 0 0-1.5Z" />
    <path d="M17 11c-1-1-2-.5-2 1.5s1 2.5 2 1.5a1 1 0 0 0 0-1.5Z" />
    <path d="M11 8c-1-1-2-.5-2 1.5s1 2.5 2 1.5a1 1 0 0 0 0-1.5Z" />
  </svg>
);

const GrainsIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? 24}
    height={props.size ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="8" cy="16" r="1.5" />
    <circle cx="12" cy="13" r="1.5" />
    <circle cx="16" cy="17" r="1.5" />
    <circle cx="10" cy="10" r="1.5" />
    <circle cx="14" cy="9" r="1.5" />
  </svg>
);

const HummusIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? 24}
    height={props.size ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 14c0 3.3 3.6 6 8 6s8-2.7 8-6" />
    <path d="M2 14h20" />
    <circle cx="9" cy="11" r="1" />
    <circle cx="13" cy="10" r="1" />
    <circle cx="16" cy="12" r="1" />
  </svg>
);

export {
  RiceSackIcon,
  FlourSackIcon,
  SackIcon as SugarSackIcon,
  OilBottleIcon,
  TinCanIcon,
  BeansIcon,
  GrainsIcon as LentilsIcon,
  HummusIcon
};
