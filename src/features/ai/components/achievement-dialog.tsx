'use client';

import * as React from 'react';
import { Sparkles, RefreshCw, Plus, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { achievementService } from '../achievement-service';
import type { AchievementSuggestion } from '../achievement';

export interface AchievementDialogProps {
  sourceText: string;
  onInsert: (text: string) => void;
}

/** "✨ Improve achievement" — offline suggestions with insert / copy / regenerate. */
export function AchievementDialog({ sourceText, onInsert }: AchievementDialogProps) {
  const t = useTranslations('achievement');
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<AchievementSuggestion[]>([]);

  const regenerate = () => setItems(achievementService.generate(sourceText || t('defaultInput'), 5));

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) regenerate();
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('copied'));
    } catch {
      toast.error(t('copyFailed'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Sparkles className="size-4" />
          {t('improve')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('subtitle')}</DialogDescription>
        </DialogHeader>

        <ul className="grid max-h-[50vh] gap-2 overflow-y-auto">
          {items.map((suggestion, index) => (
            <li
              key={index}
              className="flex items-start gap-2 rounded-md border p-2.5 text-sm"
            >
              <span className="flex-1">{suggestion.text}</span>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={t('copy')}
                  onClick={() => copy(suggestion.text)}
                >
                  <Copy className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={t('insert')}
                  onClick={() => {
                    onInsert(suggestion.text);
                    toast.success(t('inserted'));
                    setOpen(false);
                  }}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div>
          <Button type="button" variant="outline" size="sm" onClick={regenerate}>
            <RefreshCw className="size-4" />
            {t('regenerate')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
