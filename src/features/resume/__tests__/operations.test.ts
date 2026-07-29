import { describe, it, expect } from 'vitest';
import * as ops from '../operations';
import { createEmptyResumeData, createExperience, createReference } from '../factory';

const seed = () => createEmptyResumeData();

describe('resume operations', () => {
  it('creates a resume; the first one becomes active', () => {
    const { data, id } = ops.createResume(seed(), { title: 'A' });
    expect(data.order).toEqual([id]);
    expect(data.activeResumeId).toBe(id);
    expect(data.resumes[id]?.meta.title).toBe('A');
  });

  it('supports unlimited resumes with unique ids', () => {
    let data = seed();
    const ids: string[] = [];
    for (let i = 0; i < 50; i++) {
      const result = ops.createResume(data);
      data = result.data;
      ids.push(result.id);
    }
    expect(data.order).toHaveLength(50);
    expect(new Set(ids).size).toBe(50);
  });

  it('duplicates a resume with fresh ids, inserted after the source', () => {
    const created = ops.createResume(seed(), { title: 'Orig' });
    let data = ops.addArrayItem(
      created.data,
      created.id,
      'experience',
      createExperience({ company: 'X' }),
    );
    const originalExpId = data.resumes[created.id]!.sections.experience[0]!.id;

    const dup = ops.duplicateResume(data, created.id);
    data = dup.data;

    expect(dup.id).toBeTruthy();
    expect(dup.id).not.toBe(created.id);
    expect(data.order).toEqual([created.id, dup.id]);

    const copy = data.resumes[dup.id!]!;
    expect(copy.meta.title).toBe('Orig (copy)');
    expect(copy.sections.experience[0]!.company).toBe('X');
    expect(copy.sections.experience[0]!.id).not.toBe(originalExpId);
    expect(data.activeResumeId).toBe(dup.id);
  });

  it('returns null id when duplicating a missing resume', () => {
    const result = ops.duplicateResume(seed(), 'nope');
    expect(result.id).toBeNull();
  });

  it('deletes a resume and reassigns the active id', () => {
    let data = seed();
    const a = ops.createResume(data);
    data = a.data;
    const b = ops.createResume(data);
    data = b.data;

    data = ops.setActiveResume(data, a.id);
    data = ops.deleteResume(data, a.id);

    expect(data.order).toEqual([b.id]);
    expect(data.resumes[a.id]).toBeUndefined();
    expect(data.activeResumeId).toBe(b.id);
  });

  it('adds, updates, reorders, and removes array items', () => {
    const created = ops.createResume(seed());
    let data = created.data;
    const e1 = createExperience({ company: 'One' });
    const e2 = createExperience({ company: 'Two' });

    data = ops.addArrayItem(data, created.id, 'experience', e1);
    data = ops.addArrayItem(data, created.id, 'experience', e2);
    expect(data.resumes[created.id]!.sections.experience.map((e) => e.company)).toEqual([
      'One',
      'Two',
    ]);

    data = ops.updateArrayItem(data, created.id, 'experience', e1.id, { company: 'Uno' });
    expect(data.resumes[created.id]!.sections.experience[0]!.company).toBe('Uno');

    data = ops.reorderArrayItems(data, created.id, 'experience', [e2.id, e1.id]);
    expect(data.resumes[created.id]!.sections.experience.map((e) => e.id)).toEqual([e2.id, e1.id]);

    data = ops.removeArrayItem(data, created.id, 'experience', e1.id);
    expect(data.resumes[created.id]!.sections.experience).toHaveLength(1);
  });

  it('refreshes updatedAt and edits basics on mutation', async () => {
    const created = ops.createResume(seed());
    let data = created.data;
    const before = data.resumes[created.id]!.meta.updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 2));
    data = ops.updateBasics(data, created.id, { fullName: 'Sara' });

    const after = data.resumes[created.id]!.meta.updatedAt;
    expect(new Date(after).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime());
    expect(data.resumes[created.id]!.basics.fullName).toBe('Sara');
  });

  it('supports the references section via generic array ops', () => {
    const created = ops.createResume(seed());
    let data = created.data;
    const ref = createReference({ name: 'Jane Doe', relationship: 'Manager' });
    data = ops.addArrayItem(data, created.id, 'references', ref);
    expect(data.resumes[created.id]!.sections.references[0]!.name).toBe('Jane Doe');
    data = ops.removeArrayItem(data, created.id, 'references', ref.id);
    expect(data.resumes[created.id]!.sections.references).toHaveLength(0);
  });

  it('does not mutate the input data (immutability)', () => {
    const original = seed();
    const { data } = ops.createResume(original, { title: 'A' });
    expect(original.order).toHaveLength(0);
    expect(data.order).toHaveLength(1);
  });
});
