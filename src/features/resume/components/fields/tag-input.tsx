'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  id?: string;
  description?: string;
}

/**
 * Edits a list of short strings (skills, technologies) as removable chips.
 * Enter or comma adds; Backspace on an empty field removes the last chip.
 */
export function TagInput({
  label,
  values,
  onChange,
  placeholder,
  id,
  description,
}: TagInputProps) {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  const [draft, setDraft] = React.useState('');

  const add = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    if (!values.includes(value)) onChange([...values, value]);
    setDraft('');
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      removeAt(values.length - 1);
    }
  };

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      {values.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={label}>
          {values.map((value, index) => (
            <li
              key={`${value}-${index}`}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
            >
              {value}
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${value}`}
                className="rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Input
        id={fieldId}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => add(draft)}
      />
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
