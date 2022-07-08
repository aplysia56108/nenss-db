import Hierarchy from '../../src/hierarchy';
import { Tsdb, ISnapshot } from '../../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callback = <T = any>(_snapshot: ISnapshot<T>): void => {
  return;
};

test('subscribe test', async () => {
  const tsdb = new Tsdb();
  const mockClearSubscriptions = jest.spyOn(
    Hierarchy.prototype,
    'clearSubscriptions',
  );
  const subscriptionA = jest.fn(callback);
  const subscriptionB = jest.fn(callback);
  const subscriptionC = jest.fn(callback);
  const subscriptionD = jest.fn(callback);
  const subscriptionE = jest.fn(callback);

  const idA = tsdb.subscribe('/', subscriptionA);
  const idB = tsdb.subscribe('/', subscriptionB);
  const idC = tsdb.subscribe('/apple', subscriptionC);
  const idD = tsdb.subscribe('/banana', subscriptionD);
  const idE = tsdb.subscribe('/apple/color', subscriptionE);

  await tsdb.set('/apple/color', 'red');
  tsdb.unsubscribe(idB);
  await tsdb.push('/peach', 'pink', 'color');
  await tsdb.update('/apple', {
    ['color']: 'single red',
    ['shape']: 'sphere',
    ['category']: 'fruit',
  });
  await tsdb.delete('/apple/color');
  tsdb.unsubscribe();
  // await tsdb.set('/', null);

  expect(mockClearSubscriptions.mock.calls.length).toBe(1);

  expect(subscriptionA.mock.calls.length).toBe(4);
  expect(subscriptionA.mock.calls[0][0].val()).toEqual({
    ['apple']: { ['color']: 'red' },
  });
  expect(subscriptionA.mock.calls[1][0].val()).toEqual({
    ['apple']: { ['color']: 'red' },
    ['peach']: { ['color']: 'pink' },
  });
  expect(subscriptionA.mock.calls[2][0].val()).toEqual({
    ['apple']: {
      ['color']: 'single red',
      ['shape']: 'sphere',
      ['category']: 'fruit',
    },
    ['peach']: { ['color']: 'pink' },
  });
  expect(subscriptionA.mock.calls[3][0].val()).toEqual({
    ['apple']: {
      ['shape']: 'sphere',
      ['category']: 'fruit',
    },
    ['peach']: { ['color']: 'pink' },
  });

  expect(subscriptionB.mock.calls.length).toBe(1);
  expect(subscriptionB.mock.calls[0][0].val()).toEqual({
    ['apple']: { ['color']: 'red' },
  });

  expect(subscriptionC.mock.calls.length).toBe(3);
  expect(subscriptionC.mock.calls[0][0].val()).toEqual({
    ['color']: 'red',
  });
  expect(subscriptionC.mock.calls[1][0].val()).toEqual({
    ['color']: 'single red',
    ['shape']: 'sphere',
    ['category']: 'fruit',
  });
  expect(subscriptionC.mock.calls[2][0].val()).toEqual({
    ['shape']: 'sphere',
    ['category']: 'fruit',
  });

  expect(subscriptionD.mock.calls.length).toBe(0);

  expect(subscriptionE.mock.calls.length).toBe(3);
  expect(subscriptionE.mock.calls[0][0].val()).toEqual('red');
  expect(subscriptionE.mock.calls[1][0].val()).toEqual('single red');
  expect(subscriptionE.mock.calls[2][0].val()).toEqual(null);

  expect(() => tsdb.unsubscribe(idA)).toThrow(Error);
  expect(() => tsdb.unsubscribe(idB)).toThrow(Error);
  expect(() => tsdb.unsubscribe(idC)).toThrow(Error);
  expect(() => tsdb.unsubscribe(idD)).toThrow(Error);
  expect(() => tsdb.unsubscribe(idE)).toThrow(Error);
});
