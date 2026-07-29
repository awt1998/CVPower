'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  id?: string;
  error?: string;
}

/**
 * Labeled native `<select>` styled to match the design system. Native select is
 * used deliberately: it is fully keyboard- and screen-reader-accessible and RTL
 * aware without extra dependencies.
 */
export function SelectField({ label, value, onChange, options, id, error }: SelectFieldProps) {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        <select
          id={fieldId}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-10 w-full appearance-none rounded-md border border-input bg-background ps-3 pe-9 text-sm shadow-xs transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
