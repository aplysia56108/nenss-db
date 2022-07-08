import Hierarchy from '../../src/hierarchy';
import InnerObject from '../../src/inner-object';
import { Subscriptions } from '../../src/common/types';
import { Snapshot } from '../../src/snapshot';
import DataConverter from '../../src/common/data-converter';

/* eslint-disable @typescript-eslint/no-explicit-any */

const callback = <T = any>(_snapshot: Snapshot<T>): void => {
  return;
};

describe('hierarchy test', () => {
  test('subscription test', async () => {
    const subscriptionA = jest.fn(callback);
    const subscriptionB = jest.fn(callback);
    const subscriptionC = jest.fn(callback);
    const subscriptionD = jest.fn(callback);
    const subscriptionE = jest.fn(callback);
    const subscriptionF = jest.fn(callback);
    const subscriptions: Subscriptions = {
      ['/']: {
        ['a']: subscriptionA,
        ['b']: subscriptionB,
        ['c']: subscriptionC,
      },
      ['/apple']: { ['d']: subscriptionD, ['e']: subscriptionE },
      ['/apple/orange']: { ['f']: subscriptionF },
    };
    const hierarchy = new Hierarchy(5) as any;
    hierarchy.subscribe('/', 'a', subscriptionA);
    hierarchy.subscribe('/', 'b', subscriptionB);
    hierarchy.subscribe('/', 'c', subscriptionC);
    hierarchy.subscribe('/apple', 'd', subscriptionD);
    hierarchy.subscribe('/apple', 'e', subscriptionE);
    hierarchy.subscribe('/apple/orange', 'f', subscriptionF);
    expect(() => hierarchy.unsubscribe('g')).toThrow(Error);
    expect(hierarchy.subscriptions).toEqual(subscriptions);
    hierarchy.unsubscribe('c');
    expect(hierarchy.subscriptions).toEqual({
      ['/']: {
        ['a']: subscriptionA,
        ['b']: subscriptionB,
      },
      ['/apple']: { ['d']: subscriptionD, ['e']: subscriptionE },
      ['/apple/orange']: { ['f']: subscriptionF },
    });
    hierarchy.unsubscribe('b');
    hierarchy.unsubscribe('a');
    expect(hierarchy.subscriptions).toEqual({
      ['/apple']: { ['d']: subscriptionD, ['e']: subscriptionE },
      ['/apple/orange']: { ['f']: subscriptionF },
    });
    expect(() => hierarchy.unsubscribe('a')).toThrow(Error);

    await hierarchy.set(['', 'apple', 'orange'], 'banana');
    hierarchy.clearSubscriptions();
    await hierarchy.set(['', 'apple', 'orange'], null);
    expect(hierarchy.subscriptions).toEqual({});
    expect(hierarchy.subscribedRefs).toEqual({});
    expect(() => hierarchy.unsubscribe('a')).toThrow(Error);
    expect(() => hierarchy.unsubscribe('b')).toThrow(Error);
    expect(() => hierarchy.unsubscribe('c')).toThrow(Error);
    expect(() => hierarchy.unsubscribe('d')).toThrow(Error);
    expect(() => hierarchy.unsubscribe('e')).toThrow(Error);
    expect(() => hierarchy.unsubscribe('f')).toThrow(Error);
    expect(subscriptionD.mock.calls.length).toBe(1);
    expect(subscriptionD.mock.calls[0][0].val()).toEqual({
      ['orange']: 'banana',
    });
    expect(subscriptionE.mock.calls.length).toBe(1);
    expect(subscriptionE.mock.calls[0][0].val()).toEqual({
      ['orange']: 'banana',
    });
    expect(subscriptionF.mock.calls.length).toBe(1);
    expect(subscriptionF.mock.calls[0][0].val()).toEqual('banana');
  });

  test('set test', () => {
    const hierarchy = new Hierarchy(5);
    const mockRollBack = jest.spyOn(InnerObject.prototype, 'rollBack');
    const subscription = jest.fn(callback);
    hierarchy.subscribe('/apple/color', 'a', subscription);
    hierarchy.set(['', 'apple', 'color'], 'red');
    expect(
      DataConverter.toData(hierarchy.search(['', 'apple', 'color'])),
    ).toEqual('red');
    expect(mockRollBack.mock.calls.length).toBe(3);
    expect(subscription.mock.calls.length).toBe(1);
    mockRollBack.mockRestore();
  });

  test('push test', () => {
    const hierarchy = new Hierarchy(5);
    const mockRollBack = jest.spyOn(InnerObject.prototype, 'rollBack');
    const subscription = jest.fn(callback);
    hierarchy.subscribe('/apple/color', 'a', subscription);
    hierarchy.push(['', 'apple'], 'red', 'color');
    expect(DataConverter.toData(hierarchy.search(['', 'apple']))).toEqual({
      ['color']: 'red',
    });
    expect(mockRollBack.mock.calls.length).toBe(2);
    expect(subscription.mock.calls.length).toBe(1);
    mockRollBack.mockRestore();
  });

  test('update test', () => {
    const hierarchy = new Hierarchy(5);
    const mockRollBack = jest.spyOn(InnerObject.prototype, 'rollBack');
    const subscription = jest.fn(callback);
    hierarchy.subscribe('/fruit', 'a', subscription);
    hierarchy.update(['', 'fruit'], {
      ['apple']: 'red',
      ['banana']: 'yellow',
      ['orange']: 'orange',
    });
    expect(DataConverter.toData(hierarchy.search(['', 'fruit']))).toEqual({
      ['apple']: 'red',
      ['banana']: 'yellow',
      ['orange']: 'orange',
    });
    expect(mockRollBack.mock.calls.length).toBe(2);
    expect(subscription.mock.calls.length).toBe(1);
    mockRollBack.mockRestore();
  });

  test('delete test', () => {
    const hierarchy = new Hierarchy(5);
    const mockRollBack = jest.spyOn(InnerObject.prototype, 'rollBack');
    hierarchy.set(['', 'apple', 'color'], 'red');
    hierarchy.delete(['', 'apple', 'color']);
    expect(
      DataConverter.toData(hierarchy.search(['', 'apple', 'color'])),
    ).toEqual(null);
    expect(DataConverter.toData(hierarchy.search(['']))).toEqual(null);
    expect(mockRollBack.mock.calls.length).toBe(6);
    mockRollBack.mockRestore();
  });

  test('search and get test', () => {
    const object = {
      ['apple']: 'red',
      ['banana']: 'yellow',
      ['orange']: 'orange',
    };
    const hierarchy = new Hierarchy() as any;
    const subscription = jest.fn(callback);
    hierarchy.subscribe('/', 'a', subscription);
    hierarchy.set(['', 'apple'], 'red');
    hierarchy.set(['', 'banana'], 'yellow');
    hierarchy.set(['', 'orange'], 'orange');
    expect(DataConverter.toData(hierarchy.search(['']))).toEqual(object);
    expect(DataConverter.toData(hierarchy.get(['']).getObject())).toEqual(
      object,
    );
    const nullObject1 = hierarchy.search(['', 'peach']);
    expect(DataConverter.toData(hierarchy.search(['']))).toEqual(object);
    const nullObject2 = hierarchy.get(['', 'peach']);
    expect(DataConverter.toData(hierarchy.search(['']))).toEqual({
      ['apple']: 'red',
      ['banana']: 'yellow',
      ['orange']: 'orange',
      ['peach']: null,
    });
    expect(DataConverter.toData(nullObject1)).toEqual(null);
    expect(DataConverter.toData(nullObject2.getObject())).toEqual(null);
    subscription.mockClear();
    nullObject2.rollBack();
    expect(subscription.mock.calls.length).toEqual(1);
    expect(
      DataConverter.toData(hierarchy.search(['', 'apple', 'red'])),
    ).toEqual(null);
    expect(DataConverter.toData(hierarchy.search(['']))).toEqual({
      ['apple']: 'red',
      ['banana']: 'yellow',
      ['orange']: 'orange',
      ['peach']: null,
    });
    expect(
      DataConverter.toData(hierarchy.get(['', 'apple', 'red']).getObject()),
    ).toEqual(null);
    expect(DataConverter.toData(hierarchy.search(['']))).toEqual({
      ['apple']: null,
      ['banana']: 'yellow',
      ['orange']: 'orange',
      ['peach']: null,
    });
  });
});
