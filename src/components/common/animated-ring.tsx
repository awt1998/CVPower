'use client';

import { motion } from 'framer-motion';

import { AnimatedNumber } from './animated-number';

export interface AnimatedRingProps {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  ariaLabel: string;
}

/** Animated circular gauge (0–100), colored by band. Reused across dashboards. */
export function AnimatedRing({ value, size = 128, stroke = 8, label, ariaLabel }: AnimatedRingProps) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - v / 100);
  const color = v >= 75 ? 'text-success' : v >= 50 ? 'text-warning' : 'text-destructive';
  const center = size / 2;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={color}
        role="img"
        aria-label={ariaLabel}
      >
        <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={stroke} />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <AnimatedNumber value={v} className="text-3xl font-bold text-foreground" />
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
