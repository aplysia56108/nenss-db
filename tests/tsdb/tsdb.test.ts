import Hierarchy from '../../src/hierarchy';
import { Data } from '../../src/common/types';
import { Tsdb, ISnapshot } from '../../src';

/* eslint-disable @typescript-eslint/no-explicit-any */

const callback = <T = any>(_snapshot: ISnapshot<T>): void => {
  return;
};

test('setTimeout test', async () => {
  expect.assertions(4);
  const output = jest.fn((message: string) => message);
  await Promise.all([
    new Promise((resolve) => {
      new Promise((resolve) => setTimeout(resolve, 200))
        .then(() => output('1'))
        .then(() => resolve(0));
    }),
    new Promise((resolve) => {
      new Promise((resolve) => setTimeout(resolve, 100))
        .then(() => output('2'))
        .then(() => resolve(0));
    }),
    new Promise((resolve) => {
      new Promise((resolve) => setTimeout(resolve, 50))
        .then(() => output('3'))
        .then(() => resolve(0));
    }),
  ]);
  expect(output.mock.calls.length).toBe(3);
  expect(output.mock.calls[0][0]).toBe('3');
  expect(output.mock.calls[1][0]).toBe('2');
  expect(output.mock.calls[2][0]).toBe('1');
});

test('subscribe test', async () => {
  expect.assertions(22);
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

test('push test', async () => {
  expect.assertions(4);
  const tsdb = new Tsdb();
  const mockFunction = jest.fn((message: string) => message);
  const mockSet = jest
    .spyOn(Hierarchy.prototype, 'set')
    .mockImplementation(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      await new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        mockFunction('pushed'),
      );
    });
  mockFunction(await tsdb.push('/apple', 'red', 'color'));
  expect(mockFunction.mock.calls.length).toBe(2);
  expect(mockFunction.mock.calls[0][0]).toBe('pushed');
  expect(mockFunction.mock.calls[1][0]).toBe('color');
  expect(mockSet.mock.calls.length).toBe(1);
  mockSet.mockRestore();
});

test('update test', async () => {
  expect.assertions(24);
  const tsdb = new Tsdb();
  const mockFunction = jest.fn((message: string) => message);
  const mockSet = jest
    .spyOn(Hierarchy.prototype, 'nonRollbackSet')
    .mockImplementationOnce(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      mockFunction(data as unknown as string);
      await new Promise((resolve) => setTimeout(resolve, 200));
      mockFunction(data as unknown as string);
    })
    .mockImplementationOnce(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      mockFunction(data as unknown as string);
      await new Promise((resolve) => setTimeout(resolve, 100));
      mockFunction(data as unknown as string);
    })
    .mockImplementationOnce(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      mockFunction(data as unknown as string);
      await new Promise((resolve) => setTimeout(resolve, 50));
      mockFunction(data as unknown as string);
    })
    .mockImplementationOnce(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      mockFunction(data as unknown as string);
      await new Promise((resolve) => setTimeout(resolve, 250));
      mockFunction(data as unknown as string);
    })
    .mockImplementationOnce(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      mockFunction(data as unknown as string);
      await new Promise((resolve) => setTimeout(resolve, 150));
      mockFunction(data as unknown as string);
    })
    .mockImplementationOnce(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      mockFunction(data as unknown as string);
      await new Promise((resolve) => setTimeout(resolve, 50));
      mockFunction(data as unknown as string);
    })
    .mockImplementationOnce(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      mockFunction(data as unknown as string);
      await new Promise((resolve) => setTimeout(resolve, 200));
      mockFunction(data as unknown as string);
    })
    .mockImplementationOnce(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      mockFunction(data as unknown as string);
      await new Promise((resolve) => setTimeout(resolve, 250));
      mockFunction(data as unknown as string);
    })
    .mockImplementationOnce(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      mockFunction(data as unknown as string);
      await new Promise((resolve) => setTimeout(resolve, 100));
      mockFunction(data as unknown as string);
    })
    .mockImplementationOnce(async (refArray: string[], data: Data | null) => {
      refArray;
      data;
      mockFunction(data as unknown as string);
      await new Promise((resolve) => setTimeout(resolve, 150));
      mockFunction(data as unknown as string);
    });
  tsdb.subscribe('/', <T = any>(_snapshot: ISnapshot<T>): void => {
    mockFunction('root');
    return;
  });

  await tsdb.update('/', {
    ['apple']: 'red',
    ['banana']: 'yellow',
    ['peach']: 'pink',
    ['orange']: 'orange',
    ['watermelon']: 'green',
  });

  await tsdb.update('/', {
    ['orange']: 'orange',
    ['apple']: 'red',
    ['watermelon']: 'green',
    ['peach']: 'pink',
    ['banana']: 'yellow',
  });

  expect(mockSet.mock.calls.length).toBe(10);
  expect(mockFunction.mock.calls.length).toBe(22);
  expect(mockFunction.mock.calls[0][0]).toBe('red');
  expect(mockFunction.mock.calls[1][0]).toBe('yellow');
  expect(mockFunction.mock.calls[2][0]).toBe('pink');
  expect(mockFunction.mock.calls[3][0]).toBe('orange');
  expect(mockFunction.mock.calls[4][0]).toBe('green');

  expect(mockFunction.mock.calls[5][0]).toBe('pink');
  expect(mockFunction.mock.calls[6][0]).toBe('yellow');
  expect(mockFunction.mock.calls[7][0]).toBe('green');
  expect(mockFunction.mock.calls[8][0]).toBe('red');
  expect(mockFunction.mock.calls[9][0]).toBe('orange');
  expect(mockFunction.mock.calls[10][0]).toBe('root');

  expect(mockFunction.mock.calls[11][0]).toBe('orange');
  expect(mockFunction.mock.calls[12][0]).toBe('red');
  expect(mockFunction.mock.calls[13][0]).toBe('green');
  expect(mockFunction.mock.calls[14][0]).toBe('pink');
  expect(mockFunction.mock.calls[15][0]).toBe('yellow');

  expect(mockFunction.mock.calls[16][0]).toBe('orange');
  expect(mockFunction.mock.calls[17][0]).toBe('pink');
  expect(mockFunction.mock.calls[18][0]).toBe('yellow');
  expect(mockFunction.mock.calls[19][0]).toBe('red');
  expect(mockFunction.mock.calls[20][0]).toBe('green');
  expect(mockFunction.mock.calls[21][0]).toBe('root');
  mockSet.mockRestore();
});
