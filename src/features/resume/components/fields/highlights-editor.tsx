'use client';

import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BulletHints } from '@/features/ai';
import { arrayMove } from '../utils';

export interface HighlightsEditorProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  addLabel: string;
  placeholder?: string;
  /** Show rule-based improvement hints under each bullet. */
  showHints?: boolean;
}

/** Edits a list of bullet-point strings with add, remove, and reorder. */
export function HighlightsEditor({
  label,
  values,
  onChange,
  addLabel,
  placeholder,
  showHints = false,
}: HighlightsEditorProps) {
  const update = (index: number, value: string) =>
    onChange(values.map((v, i) => (i === index ? value : v)));
  const remove = (index: number) => onChange(values.filter((_, i) => i !== index));
  const move = (index: number, delta: number) => onChange(arrayMove(values, index, index + delta));

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {values.map((value, index) => (
        <div key={index} className="grid gap-1">
          <div className="flex items-start gap-1.5">
            <Input
              value={value}
              placeholder={placeholder}
              aria-label={`${label} ${index + 1}`}
              onChange={(e) => update(index, e.target.value)}
            />
            <div className="flex shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                disabled={index === 0}
                aria-label="Move up"
                onClick={() => move(index, -1)}
              >
                <ChevronUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                disabled={index === values.length - 1}
                aria-label="Move down"
                onClick={() => move(index, 1)}
              >
                <ChevronDown className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 text-muted-foreground hover:text-destructive"
                aria-label="Remove"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
          {showHints && value.trim() && <BulletHints text={value} />}
        </div>
      ))}
      <div>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ''])}>
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
