'use client';

import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface RepeatableItemProps {
  title: string;
  onRemove: () => void;
  removeLabel: string;
  children: React.ReactNode;
}

/** A card wrapping one repeatable section entry, with a delete control. Reordering
 * is handled by the surrounding drag-and-drop list. */
export function RepeatableItem({ title, onRemove, removeLabel, children }: RepeatableItemProps) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-muted-foreground">{title}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
          aria-label={removeLabel}
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="grid gap-4">{children}</div>
    </Card>
  );
}
