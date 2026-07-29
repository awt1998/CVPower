'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  error?: string;
  description?: string;
  rows?: number;
}

/** Labeled multi-line input with inline validation messaging. */
export function TextareaField({
  label,
  value,
  onChange,
  id,
  placeholder,
  error,
  description,
  rows = 4,
}: TextareaFieldProps) {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  const errorId = `${fieldId}-error`;
  const descId = `${fieldId}-desc`;

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <Textarea
        id={fieldId}
        rows={rows}
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, description && descId) || undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(error && 'border-destructive focus-visible:ring-destructive')}
      />
      {description && !error && (
        <p id={descId} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
