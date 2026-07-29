'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SectionEditorProps {
  description?: string;
  isEmpty: boolean;
  emptyText: string;
  addLabel: string;
  onAdd: () => void;
  children: React.ReactNode;
}

/** Shared scaffolding for a repeatable section: description, empty state, list, add button. */
export function SectionEditor({
  description,
  isEmpty,
  emptyText,
  addLabel,
  onAdd,
  children,
}: SectionEditorProps) {
  return (
    <div className="grid gap-4">
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {isEmpty ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        <div className="grid gap-4">{children}</div>
      )}
      <div>
        <Button type="button" variant="outline" onClick={onAdd}>
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
