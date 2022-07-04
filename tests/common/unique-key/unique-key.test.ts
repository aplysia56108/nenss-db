import { jest } from '@jest/globals';
import UniqueKey from '../../../src/common/unique-key';

test('Check unique key type test', () => {
  const uniqueKey = UniqueKey.generate();
  expect(typeof uniqueKey).toBe('string');
  expect(/^[a-z]*$/.test(uniqueKey)).toBe(true);
});

test('Check random part', () => {
  // This test will fail with astronomical probability even if code is correct.
  const mockGetTime = jest
    .spyOn(Date.prototype, 'getTime')
    .mockReturnValue(1234567890);
  const uniqueKeyNumber = 100;
  const uniqueKeyList = [];
  for (let i = 0; i < uniqueKeyNumber; i++) {
    uniqueKeyList.push(UniqueKey.generate());
  }
  const uniqueKeySet = new Set(uniqueKeyList);
  expect(uniqueKeySet.size).toBe(uniqueKeyNumber);
  mockGetTime.mockRestore();
});

test('Check timestamp part', async () => {
  const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0);
  const wait = () => new Promise((resolve) => setTimeout(resolve, 5));
  const uniqueKeyNumber = 100;
  const uniqueKeyList = [];
  for (let i = 0; i < uniqueKeyNumber; i++) {
    uniqueKeyList.push(UniqueKey.generate());
    await wait();
  }
  const uniqueKeySet = new Set(uniqueKeyList);
  expect(uniqueKeySet.size).toBe(uniqueKeyNumber);
  expect([...uniqueKeyList].sort()).toEqual(uniqueKeyList);
  mockRandom.mockRestore();
});
