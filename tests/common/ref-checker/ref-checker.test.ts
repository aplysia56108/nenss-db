import {
  InvalidReferenceError,
  InvalidKeyStringError,
} from '../../../src/common/error';
import RefChecker from '../../../src/common/ref-checker';

/* eslint-disable @typescript-eslint/no-explicit-any */

test('checkRefString test', () => {
  const refChecker = RefChecker as any;
  refChecker.checkRefString('aaa');
  refChecker.checkRefString('AAA');
  refChecker.checkRefString('111');
  refChecker.checkRefString('0sE');
  refChecker.checkRefString('___');
  refChecker.checkRefString('---');
  refChecker.checkRefString('_A-z_9');
  expect(() => refChecker.checkRefString('+')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('/')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('¥')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('\\')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('?')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('@')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('(')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString(')')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('"')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('!')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('#')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('$')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('%')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('&')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString("'")).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('^')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('~')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('=')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('|')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('{')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('}')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('[')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString(']')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('*')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString(';')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString(':')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString(',')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('.')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('<')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('>')).toThrow(InvalidKeyStringError);
  expect(() => refChecker.checkRefString('2aS-\\')).toThrow(
    InvalidKeyStringError,
  );
  expect(() => refChecker.checkRefString('')).toThrow(InvalidKeyStringError);
  let tooLongString = '';
  for (let i = 0; i < 999; i++) {
    tooLongString += 'a';
  }
  expect(refChecker.checkRefString(tooLongString));
  tooLongString += 'a';
  expect(() => refChecker.checkRefString(tooLongString)).toThrow(
    InvalidKeyStringError,
  );
});

test('checkRefArray test', () => {
  const refChecker = RefChecker as any;
  refChecker.checkRefArray(['']);
  refChecker.checkRefArray(['', '9tT']);
  expect(() => refChecker.checkRefArray(['9tT', ''])).toThrow(
    InvalidReferenceError,
  );
  expect(() => refChecker.checkRefArray(['', '/test'])).toThrow(
    InvalidKeyStringError,
  );
});

test('toRefArray test', () => {
  expect(RefChecker.toRefArray('/')).toEqual(['']);
  expect(RefChecker.toRefArray('/apple/123')).toEqual(['', 'apple', '123']);
  expect(() => RefChecker.toRefArray('//')).toThrow(InvalidKeyStringError);
  expect(() => RefChecker.toRefArray('a')).toThrow(InvalidReferenceError);
  expect(() => RefChecker.toRefArray('/~')).toThrow(InvalidKeyStringError);
});

test('isIncluded test', () => {
  expect(RefChecker.isIncluded('/abc/d', '/abc')).toBe(true);
  expect(RefChecker.isIncluded('/abc/d', '/')).toBe(true);
  expect(RefChecker.isIncluded('/abc/d', '/abc/d')).toBe(true);
  expect(RefChecker.isIncluded('abcd', 'abcd/efg')).toBe(false);
  expect(RefChecker.isIncluded('/abc/d', '/ab')).toBe(false);
  expect(RefChecker.isIncluded('/abc/d', '/efg')).toBe(false);
});
