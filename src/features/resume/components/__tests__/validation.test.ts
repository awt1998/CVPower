import { describe, it, expect } from 'vitest';
import { fieldErrors } from '../validation';
import { basicsSchema, referenceSchema } from '../../schema';
import { createEmptyBasics } from '../../factory';

describe('fieldErrors', () => {
  it('returns no errors for a valid basics object', () => {
    expect(fieldErrors(basicsSchema, createEmptyBasics())).toEqual({});
  });

  it('flags an invalid email on basics', () => {
    const errors = fieldErrors(basicsSchema, { fullName: '', links: [], email: 'bad' });
    expect(errors['email']).toBeTruthy();
  });

  it('flags an invalid reference email', () => {
    const errors = fieldErrors(referenceSchema, { id: '1', name: 'X', email: 'nope' });
    expect(errors['email']).toBeTruthy();
  });

  it('accepts empty optional fields', () => {
    expect(fieldErrors(referenceSchema, { id: '1', name: 'X', email: '' })).toEqual({});
  });
});
