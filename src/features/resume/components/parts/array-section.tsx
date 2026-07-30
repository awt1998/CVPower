'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { SortableList, SortableItem } from '@/components/common/sortable-list';
import { useResumeStore } from '../../store';
import { SectionEditor } from './section-editor';
import { RepeatableItem } from './repeatable-item';
import type { ArraySectionItem, ArraySectionKey, Resume } from '../../types';

export interface ArraySectionLabels {
  add: string;
  empty: string;
  description?: string;
  moveUp: string;
  moveDown: string;
  remove: string;
}

export interface ArraySectionProps<K extends ArraySectionKey> {
  resume: Resume;
  sectionKey: K;
  createItem: () => ArraySectionItem<K>;
  itemTitle: (item: ArraySectionItem<K>, index: number) => string;
  renderItem: (
    item: ArraySectionItem<K>,
    helpers: { update: (patch: Partial<ArraySectionItem<K>>) => void },
  ) => React.ReactNode;
  labels: ArraySectionLabels;
}

/**
 * Generic editor for any array-based resume section: each entry is a draggable,
 * removable card; add/update/remove/reorder are wired to the store.
 */
export function ArraySection<K extends ArraySectionKey>({
  resume,
  sectionKey,
  createItem,
  itemTitle,
  renderItem,
  labels,
}: ArraySectionProps<K>) {
  const tc = useTranslations('builder.common');
  const items = resume.sections[sectionKey] as unknown as ArraySectionItem<K>[];

  const add = () => useResumeStore.getState().addArrayItem(resume.id, sectionKey, createItem());
  const remove = (itemId: string) =>
    useResumeStore.getState().removeArrayItem(resume.id, sectionKey, itemId);
  const reorder = (orderedIds: string[]) =>
    useResumeStore.getState().reorderArrayItems(resume.id, sectionKey, orderedIds);

  return (
    <SectionEditor
      description={labels.description}
      isEmpty={items.length === 0}
      emptyText={labels.empty}
      addLabel={labels.add}
      onAdd={add}
    >
      <SortableList ids={items.map((item) => item.id)} onReorder={reorder}>
        {items.map((item, index) => (
          <SortableItem key={item.id} id={item.id} handleLabel={tc('reorder')}>
            <RepeatableItem
              title={itemTitle(item, index)}
              onRemove={() => remove(item.id)}
              removeLabel={labels.remove}
            >
              {renderItem(item, {
                update: (patch) =>
                  useResumeStore.getState().updateArrayItem(resume.id, sectionKey, item.id, patch),
              })}
            </RepeatableItem>
          </SortableItem>
        ))}
      </SortableList>
    </SectionEditor>
  );
}
