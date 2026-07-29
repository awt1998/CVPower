'use client';

import * as React from 'react';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface RepeatableItemProps {
  title: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
  labels: { moveUp: string; moveDown: string; remove: string };
  children: React.ReactNode;
}

/** A card wrapping one repeatable section entry, with reorder and delete controls. */
export function RepeatableItem({
  title,
  onMoveUp,
  onMoveDown,
  onRemove,
  disableUp,
  disableDown,
  labels,
  children,
}: RepeatableItemProps) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={disableUp}
            aria-label={labels.moveUp}
            onClick={onMoveUp}
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={disableDown}
            aria-label={labels.moveDown}
            onClick={onMoveDown}
          >
            <ChevronDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            aria-label={labels.remove}
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-4">{children}</div>
    </Card>
  );
}
