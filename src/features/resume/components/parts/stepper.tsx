'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepDescriptor {
  id: string;
  label: string;
}

export interface StepperProps {
  steps: StepDescriptor[];
  currentIndex: number;
  completed: Record<string, boolean>;
  onSelect: (index: number) => void;
  ariaLabel: string;
}

/** Vertical step navigation for the resume builder. Keyboard operable. */
export function Stepper({ steps, currentIndex, completed, onSelect, ariaLabel }: StepperProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className="grid gap-1">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isDone = completed[step.id];
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-start text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-secondary font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs',
                    isActive && 'border-primary bg-primary text-primary-foreground',
                    !isActive && isDone && 'border-success bg-success text-success-foreground',
                    !isActive && !isDone && 'border-border',
                  )}
                >
                  {isDone && !isActive ? <Check className="size-3.5" /> : index + 1}
                </span>
                <span className="truncate">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
