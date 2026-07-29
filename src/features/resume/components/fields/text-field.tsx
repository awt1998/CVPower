'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string;
  description?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

/** Labeled text input with inline validation messaging. Fully accessible. */
export function TextField({
  label,
  value,
  onChange,
  id,
  type = 'text',
  placeholder,
  error,
  description,
  autoComplete,
  inputMode,
}: TextFieldProps) {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  const errorId = `${fieldId}-error`;
  const descId = `${fieldId}-desc`;

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        id={fieldId}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
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
