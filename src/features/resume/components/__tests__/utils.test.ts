import { describe, it, expect } from 'vitest';
import { arrayMove, movedIdOrder } from '../utils';

describe('arrayMove', () => {
  it('moves an item forward', () => {
    expect(arrayMove(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
  });

  it('moves an item backward', () => {
    expect(arrayMove(['a', 'b', 'c'], 2, 1)).toEqual(['a', 'c', 'b']);
  });

  it('returns a copy when indices are out of range', () => {
    expect(arrayMove(['a'], 0, 5)).toEqual(['a']);
  });
});

describe('movedIdOrder', () => {
  it('returns the id order after a move', () => {
    expect(movedIdOrder([{ id: 'a' }, { id: 'b' }, { id: 'c' }], 0, 1)).toEqual(['b', 'a', 'c']);
  });
});
