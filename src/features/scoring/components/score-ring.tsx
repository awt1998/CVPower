'use client';

export interface ScoreRingProps {
  score: number;
  label?: string;
  ariaLabel: string;
}

/** Circular gauge for the overall 0–100 score, colored by band. */
export function ScoreRing({ score, label, ariaLabel }: ScoreRingProps) {
  const value = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  const color = value >= 75 ? 'text-success' : value >= 50 ? 'text-warning' : 'text-destructive';

  return (
    <div className="relative inline-flex size-32 items-center justify-center">
      <svg
        width={128}
        height={128}
        viewBox="0 0 128 128"
        className={color}
        role="img"
        aria-label={ariaLabel}
      >
        <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={8} />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 64 64)"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {label && <div className="text-xs text-muted-foreground">{label}</div>}
      </div>
    </div>
  );
}
