import { jest } from '@jest/globals';
import ITsdb from '../../src/tsdb/i-tsdb';
import { ISnapshot } from '../../src/snapshot';

const createNewTsdb = (): ITsdb => {
  // TODO: replace with real implementation
  const newTsdb = new Object() as ITsdb;
  return newTsdb;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callback = <T = any>(_snapshot: ISnapshot<T>): void => {
  return;
};

// TODO: remove skip to run test
describe.skip('E2E Tests', () => {
  test('Read empty db test', async () => {
    const tsdb = createNewTsdb();
    const rootData = tsdb.get('/');
    expect(rootData).toBe(null);

    const someRefData = tsdb.get('/some/ref');
    expect(someRefData).toBe(null);
  });

  test('Set and get map test', async () => {
    const tsdb = createNewTsdb();
    const rootCallback = jest.fn(callback);
    const tomatoCallback = jest.fn(callback);
    const appleCallback = jest.fn(callback);
    const orangeCallback = jest.fn(callback);
    const orangePriceCallback = jest.fn(callback);

    tsdb.subscribe('/', rootCallback);
    tsdb.subscribe('/tomato', tomatoCallback);

    const sampleData = {
      tomato: {
        color: 'red',
        price: 1,
        isVegetable: true,
      },
      apple: {
        color: 'red',
        price: 2,
        isVegetable: false,
      },
    };
    await tsdb.set('/', sampleData);

    const rootSubscriptionId = tsdb.subscribe('/apple', appleCallback);

    const rootData = await tsdb.get<typeof sampleData>('/');
    expect(rootData).toEqual(sampleData);

    const appleData = await tsdb.get('/apple');
    expect(appleData).toEqual(sampleData.apple);

    const appleColorData = await tsdb.get('/apple/color');
    expect(appleColorData).toEqual(sampleData.apple.color);

    const orangeDataBeforeSet = await tsdb.get('/orange');
    expect(orangeDataBeforeSet).toBe(null);

    const orangeData = {
      color: 'orange',
      price: 3,
      isVegetable: true,
    };
    await tsdb.set('/orange', orangeData);

    tsdb.unsubscribe(rootSubscriptionId);

    const orangeDataAfterSet = await tsdb.get('/orange');
    expect(orangeDataAfterSet).toEqual(orangeData);

    tsdb.subscribe('/orange', orangeCallback);
    tsdb.subscribe('/orange/price', orangePriceCallback);

    tsdb.set('/orange/price', 4);
    tsdb.set('/orange/isVegetable', true);
    tsdb.set('/orange/isVegetable', false);

    const rootCallbackCalls = rootCallback.mock.calls;
    expect(rootCallbackCalls.length).toBe(2);
    expect(rootCallbackCalls[0][0].val()).toEqual(sampleData);
    expect(rootCallbackCalls[1][0].val()).toEqual({
      ...sampleData,
      orange: orangeData,
    });

    const tomatoCallbackCalls = tomatoCallback.mock.calls;
    expect(tomatoCallbackCalls.length).toBe(1);
    expect(tomatoCallbackCalls[0][0].val()).toEqual(sampleData.tomato);

    const appleCallbackCalls = appleCallback.mock.calls;
    expect(appleCallbackCalls.length).toBe(0);

    const orangeCallbackCalls = orangeCallback.mock.calls;
    expect(orangeCallbackCalls.length).toBe(3);
    expect(orangeCallbackCalls[0][0].val()).toEqual({
      ...orangeData,
      price: 4,
    });
    expect(orangeCallbackCalls[1][0].val()).toEqual({
      ...orangeData,
      price: 4,
    });
    expect(orangeCallbackCalls[2][0].val()).toEqual({
      ...orangeData,
      price: 4,
      isVegetable: false,
    });

    const orangePriceCallbackCalls = orangePriceCallback.mock.calls;
    expect(orangePriceCallbackCalls.length).toBe(1);
    expect(orangePriceCallbackCalls[0][0].val()).toEqual({
      ...orangeData,
      price: 4,
    });
  });

  test('Set and get array test', async () => {
    const tsdb = createNewTsdb();
    const sampleArray = ['zero', 'one', 'three'];

    await tsdb.set('/array', sampleArray);

    const arrayData = await tsdb.get('/array');

    const keys = Object.keys(arrayData);
    expect(keys).toEqual(['0', '1', '2']);
    expect(arrayData['0']).toEqual('zero');
    expect(arrayData['1']).toEqual('one');
    expect(arrayData['2']).toEqual('three');
  });

  test('Push test', async () => {
    const wait = () => new Promise((resolve) => setTimeout(resolve, 5));

    const tsdb = createNewTsdb();
    const PUSH_NUMBER = 10;

    const pushCallback = jest.fn(callback);

    for (let i = 0; i < PUSH_NUMBER; i++) {
      await tsdb.push('/array', `data: {i}`);
      await wait();
    }

    const arrayData = await tsdb.get('/array');
    const keys = Object.keys(arrayData);
    expect(keys.length).toBe(PUSH_NUMBER);
    expect(pushCallback.mock.calls.length).toBe(PUSH_NUMBER);
    for (let i = 0; i < PUSH_NUMBER; i++) {
      expect(arrayData[keys[i]]).toEqual(`data: {${i}}`);
      expect(pushCallback.mock.calls[i][0].val()).toEqual(`data: {${i}}`);
    }
  });

  test('Update test', () => {
    const tsdb = createNewTsdb();
    const sampleData = {
      tomato: {
        color: 'red',
        price: 1,
        isVegetable: true,
      },
      apple: {
        color: 'red',
        price: 2,
        isVegetable: false,
      },
    };
    tsdb.set('/', sampleData);

    const rootCallback = jest.fn(callback);
    const tomatoCallback = jest.fn(callback);
    const appleCallback = jest.fn(callback);

    tsdb.subscribe('/', rootCallback);
    tsdb.subscribe('/tomato', tomatoCallback);
    tsdb.subscribe('/apple', appleCallback);

    const tomatoUpdateData = {
      price: 2,
    };
    tsdb.update('/tomato', tomatoUpdateData);

    const rootCallbackCalls = rootCallback.mock.calls;
    expect(rootCallbackCalls.length).toBe(1);
    expect(rootCallbackCalls[0][0].val()).toEqual({
      ...sampleData,
      tomato: {
        ...sampleData.tomato,
        ...tomatoUpdateData,
      },
    });

    const tomatoCallbackCalls = tomatoCallback.mock.calls;
    expect(tomatoCallbackCalls.length).toBe(1);
    expect(tomatoCallbackCalls[0][0].val()).toEqual({
      ...sampleData.tomato,
      ...tomatoUpdateData,
    });

    const appleCallbackCalls = appleCallback.mock.calls;
    expect(appleCallbackCalls.length).toBe(0);
  });

  test('Delete test', () => {
    const tsdb = createNewTsdb();
    const sampleData = {
      tomato: {
        color: 'red',
        price: 1,
        isVegetable: true,
      },
      apple: {
        color: 'red',
        price: 2,
        isVegetable: false,
      },
    };
    tsdb.set('/', sampleData);

    const rootCallback = jest.fn(callback);
    const tomatoCallback = jest.fn(callback);
    const appleCallback = jest.fn(callback);

    tsdb.subscribe('/', rootCallback);
    tsdb.subscribe('/tomato', tomatoCallback);
    tsdb.subscribe('/apple', appleCallback);

    tsdb.delete('/tomato');
    tsdb.set('/apple', null);

    const rootCallbackCalls = rootCallback.mock.calls;
    expect(rootCallbackCalls.length).toBe(2);
    expect(rootCallbackCalls[0][0].exists()).toBe(true);
    expect(rootCallbackCalls[0][0].val()).toEqual({
      apple: sampleData.apple,
    });
    expect(rootCallbackCalls[1][0].exists()).toEqual(false);
    expect(rootCallbackCalls[1][0].val()).toEqual(null);

    const tomatoCallbackCalls = tomatoCallback.mock.calls;
    expect(tomatoCallbackCalls.length).toBe(1);
    expect(tomatoCallbackCalls[0][0].exists()).toBe(false);
    expect(tomatoCallbackCalls[0][0].val()).toEqual(null);

    const appleCallbackCalls = appleCallback.mock.calls;
    expect(appleCallbackCalls.length).toBe(1);
    expect(appleCallbackCalls[0][0].exists()).toEqual(false);
    expect(appleCallbackCalls[0][0].val()).toEqual(null);
  });
});