'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BulletHints } from '@/features/ai';
import { SortableList, SortableItem } from '@/components/common/sortable-list';

export interface HighlightsEditorProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  addLabel: string;
  placeholder?: string;
  /** Show rule-based improvement hints under each bullet. */
  showHints?: boolean;
}

/** Edits a list of bullet-point strings with add, remove, and drag-to-reorder. */
export function HighlightsEditor({
  label,
  values,
  onChange,
  addLabel,
  placeholder,
  showHints = false,
}: HighlightsEditorProps) {
  const tc = useTranslations('builder.common');
  const update = (index: number, value: string) =>
    onChange(values.map((v, i) => (i === index ? value : v)));
  const remove = (index: number) => onChange(values.filter((_, i) => i !== index));
  const reorder = (nextIds: string[]) => onChange(nextIds.map((id) => values[Number(id)] ?? ''));

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <SortableList ids={values.map((_, i) => String(i))} onReorder={reorder}>
        {values.map((value, index) => (
          <SortableItem key={index} id={String(index)} handleLabel={tc('reorder')}>
            <div className="grid gap-1">
              <div className="flex items-start gap-1.5">
                <Input
                  value={value}
                  placeholder={placeholder}
                  aria-label={`${label} ${index + 1}`}
                  onChange={(e) => update(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={tc('remove')}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {showHints && value.trim() && <BulletHints text={value} />}
            </div>
          </SortableItem>
        ))}
      </SortableList>
      <div>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ''])}>
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
