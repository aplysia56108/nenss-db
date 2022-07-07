import { InvalidReferenceError } from '../../../src/common/error';
import RefChecker from '../../../src/common/ref-checker';

/* eslint-disable @typescript-eslint/no-explicit-any */

test('isValidString test', () => {
  const refChecker = RefChecker as any;
  expect(refChecker.isValidString('aaa')).toBe(true);
  expect(refChecker.isValidString('AAA')).toBe(true);
  expect(refChecker.isValidString('111')).toBe(true);
  expect(refChecker.isValidString('0sE')).toBe(true);
  expect(refChecker.isValidString('___')).toBe(true);
  expect(refChecker.isValidString('---')).toBe(true);
  expect(refChecker.isValidString('_A-z_9')).toBe(true);
  expect(refChecker.isValidString('+')).toBe(false);
  expect(refChecker.isValidString('/')).toBe(false);
  expect(refChecker.isValidString('¥')).toBe(false);
  expect(refChecker.isValidString('\\')).toBe(false);
  expect(refChecker.isValidString('?')).toBe(false);
  expect(refChecker.isValidString('@')).toBe(false);
  expect(refChecker.isValidString('(')).toBe(false);
  expect(refChecker.isValidString(')')).toBe(false);
  expect(refChecker.isValidString('"')).toBe(false);
  expect(refChecker.isValidString('!')).toBe(false);
  expect(refChecker.isValidString('#')).toBe(false);
  expect(refChecker.isValidString('$')).toBe(false);
  expect(refChecker.isValidString('%')).toBe(false);
  expect(refChecker.isValidString('&')).toBe(false);
  expect(refChecker.isValidString("'")).toBe(false);
  expect(refChecker.isValidString('^')).toBe(false);
  expect(refChecker.isValidString('~')).toBe(false);
  expect(refChecker.isValidString('=')).toBe(false);
  expect(refChecker.isValidString('|')).toBe(false);
  expect(refChecker.isValidString('{')).toBe(false);
  expect(refChecker.isValidString('}')).toBe(false);
  expect(refChecker.isValidString('[')).toBe(false);
  expect(refChecker.isValidString(']')).toBe(false);
  expect(refChecker.isValidString('*')).toBe(false);
  expect(refChecker.isValidString(';')).toBe(false);
  expect(refChecker.isValidString(':')).toBe(false);
  expect(refChecker.isValidString(',')).toBe(false);
  expect(refChecker.isValidString('.')).toBe(false);
  expect(refChecker.isValidString('<')).toBe(false);
  expect(refChecker.isValidString('>')).toBe(false);
  expect(refChecker.isValidString('2aS-\\')).toBe(false);
  expect(refChecker.isValidString('')).toBe(false);
});

test('isValidRefArray test', () => {
  const refChecker = RefChecker as any;
  expect(refChecker.isValidRefArray([''])).toBe(true);
  expect(refChecker.isValidRefArray(['', '9tT'])).toBe(true);
  expect(refChecker.isValidRefArray(['9tT', ''])).toBe(false);
  expect(refChecker.isValidRefArray(['', '/test'])).toBe(false);
});

test('toRefArray test', () => {
  expect(RefChecker.toRefArray('/')).toEqual(['']);
  expect(RefChecker.toRefArray('/apple/123')).toEqual(['', 'apple', '123']);
  expect(() => RefChecker.toRefArray('//')).toThrow(InvalidReferenceError);
  expect(() => RefChecker.toRefArray('a')).toThrow(InvalidReferenceError);
  expect(() => RefChecker.toRefArray('/~')).toThrow(InvalidReferenceError);
});

test('isIncluded test', () => {
  expect(RefChecker.isIncluded('/abc/d', '/abc')).toBe(true);
  expect(RefChecker.isIncluded('/abc/d', '/')).toBe(true);
  expect(RefChecker.isIncluded('/abc/d', '/abc/d')).toBe(true);
  expect(RefChecker.isIncluded('abcd', 'abcd/efg')).toBe(false);
  expect(RefChecker.isIncluded('/abc/d', '/ab')).toBe(false);
  expect(RefChecker.isIncluded('/abc/d', '/efg')).toBe(false);
});
