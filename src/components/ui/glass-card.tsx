import * as React from 'react';
import { cn } from '@/lib/utils';

/** A subtle glass-morphism surface. Theme-token based so dark mode stays consistent. */
export function GlassCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/60 bg-card/70 shadow-soft backdrop-blur-md supports-[backdrop-filter]:bg-card/60',
        className,
      )}
      {...props}
    />
  );
}
