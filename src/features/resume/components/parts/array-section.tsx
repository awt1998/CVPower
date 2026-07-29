'use client';

import * as React from 'react';
import { useResumeStore } from '../../store';
import { movedIdOrder } from '../utils';
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
 * Generic editor for any array-based resume section: renders each entry in a
 * reorderable/removable card and wires add/update/remove/reorder to the store.
 */
export function ArraySection<K extends ArraySectionKey>({
  resume,
  sectionKey,
  createItem,
  itemTitle,
  renderItem,
  labels,
}: ArraySectionProps<K>) {
  const items = resume.sections[sectionKey] as unknown as ArraySectionItem<K>[];

  const add = () =>
    useResumeStore.getState().addArrayItem(resume.id, sectionKey, createItem());
  const move = (index: number, delta: number) =>
    useResumeStore
      .getState()
      .reorderArrayItems(resume.id, sectionKey, movedIdOrder(items, index, delta));
  const remove = (itemId: string) =>
    useResumeStore.getState().removeArrayItem(resume.id, sectionKey, itemId);

  return (
    <SectionEditor
      description={labels.description}
      isEmpty={items.length === 0}
      emptyText={labels.empty}
      addLabel={labels.add}
      onAdd={add}
    >
      {items.map((item, index) => (
        <RepeatableItem
          key={item.id}
          title={itemTitle(item, index)}
          disableUp={index === 0}
          disableDown={index === items.length - 1}
          onMoveUp={() => move(index, -1)}
          onMoveDown={() => move(index, 1)}
          onRemove={() => remove(item.id)}
          labels={{ moveUp: labels.moveUp, moveDown: labels.moveDown, remove: labels.remove }}
        >
          {renderItem(item, {
            update: (patch) =>
              useResumeStore.getState().updateArrayItem(resume.id, sectionKey, item.id, patch),
          })}
        </RepeatableItem>
      ))}
    </SectionEditor>
  );
}
