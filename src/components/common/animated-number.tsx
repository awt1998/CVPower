'use client';

import * as React from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

export interface AnimatedNumberProps {
  value: number;
  className?: string;
  suffix?: string;
  durationMs?: number;
}

/** A number that counts up smoothly to `value` when it changes. */
export function AnimatedNumber({ value, className, suffix = '', durationMs = 700 }: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const text = useTransform(motionValue, (v) => `${Math.round(v)}${suffix}`);

  React.useEffect(() => {
    const controls = animate(motionValue, value, { duration: durationMs / 1000, ease: 'easeOut' });
    return () => controls.stop();
  }, [value, motionValue, durationMs]);

  return <motion.span className={className}>{text}</motion.span>;
}
