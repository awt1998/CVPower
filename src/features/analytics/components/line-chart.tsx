'use client';

export interface LineChartPoint {
  value: number;
}

/** Tiny dependency-free SVG line chart for 0–100 series. Scales to its container. */
export function LineChart({ points, ariaLabel }: { points: LineChartPoint[]; ariaLabel: string }) {
  const width = 600;
  const height = 180;
  const pad = 16;
  const n = points.length;

  if (n === 0) return null;

  const x = (i: number) => (n === 1 ? width / 2 : pad + (i / (n - 1)) * (width - 2 * pad));
  const y = (v: number) => height - pad - (Math.max(0, Math.min(100, v)) / 100) * (height - 2 * pad);

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.value)}`).join(' ');
  const area = `${line} L${x(n - 1)},${height - pad} L${x(0)},${height - pad} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full text-primary" role="img" aria-label={ariaLabel}>
      {[0, 50, 100].map((g) => (
        <line
          key={g}
          x1={pad}
          x2={width - pad}
          y1={y(g)}
          y2={y(g)}
          stroke="currentColor"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
      ))}
      <path d={area} fill="currentColor" fillOpacity={0.12} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.value)} r={3} fill="currentColor" />
      ))}
    </svg>
  );
}
