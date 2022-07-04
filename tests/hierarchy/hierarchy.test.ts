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
  test('Subscription test', () => {
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
    const hierarchy = new Hierarchy(5);
    hierarchy.subscribe('/', 'a', subscriptionA);
    hierarchy.subscribe('/', 'b', subscriptionB);
    hierarchy.subscribe('/', 'c', subscriptionC);
    hierarchy.subscribe('/apple', 'd', subscriptionD);
    hierarchy.subscribe('/apple', 'e', subscriptionE);
    hierarchy.subscribe('/apple/orange', 'f', subscriptionF);
    expect(hierarchy.getSubscriptions()).toEqual(subscriptions);
    hierarchy.unsubscribe('c');
    expect(hierarchy.getSubscriptions()).toEqual({
      ['/']: {
        ['a']: subscriptionA,
        ['b']: subscriptionB,
      },
      ['/apple']: { ['d']: subscriptionD, ['e']: subscriptionE },
      ['/apple/orange']: { ['f']: subscriptionF },
    });
    hierarchy.unsubscribe('b');
    hierarchy.unsubscribe('a');
    expect(hierarchy.getSubscriptions()).toEqual({
      ['/apple']: { ['d']: subscriptionD, ['e']: subscriptionE },
      ['/apple/orange']: { ['f']: subscriptionF },
    });
    expect(() => hierarchy.unsubscribe('a')).toThrow(Error);
    hierarchy.clearSubscriptions();
    expect(hierarchy.getSubscriptions()).toEqual({});
  });

  test('set test', () => {
    const hierarchy = new Hierarchy(5);
    const innerObject = new InnerObject({}, '', 10);
    const mockGet = jest
      .spyOn(Hierarchy.prototype as any, 'get')
      .mockReturnValue(innerObject);
    const mockRollBack = jest.spyOn(innerObject, 'rollBack');
    hierarchy.set(['', 'apple', 'color'], 'red');
    expect(DataConverter.toData(innerObject.getObject())).toEqual('red');
    expect(mockGet.mock.calls.length).toBe(1);
    expect(mockRollBack.mock.calls.length).toBe(1);
    mockGet.mockRestore();
    mockRollBack.mockRestore();
  });

  test('push test', () => {
    const hierarchy = new Hierarchy(5);
    const innerObject = new InnerObject({}, '', 10);
    const mockGet = jest
      .spyOn(Hierarchy.prototype as any, 'get')
      .mockReturnValue(innerObject);
    const mockRollBack = jest.spyOn(innerObject, 'rollBack');
    const mockExeSubscription = jest.spyOn(innerObject, 'exeSubscription');
    hierarchy.push(['', 'apple'], 'red', 'color');
    expect(DataConverter.toData(innerObject.getObject())).toEqual({
      ['color']: 'red',
    });
    expect(mockGet.mock.calls.length).toBe(1);
    expect(mockExeSubscription.mock.calls.length).toBe(1);
    expect(mockRollBack.mock.calls.length).toBe(1);
    mockGet.mockRestore();
    mockExeSubscription.mockRestore();
    mockRollBack.mockRestore();
  });

  test('update test', () => {
    const hierarchy = new Hierarchy(5);
    const innerObject = new InnerObject({}, '', 10);
    const mockGet = jest
      .spyOn(Hierarchy.prototype as any, 'get')
      .mockReturnValue(innerObject);
    const mockRollBack = jest.spyOn(innerObject, 'rollBack');
    const mockExeSubscription = jest.spyOn(innerObject, 'exeSubscription');
    hierarchy.update(['', 'fruit'], {
      ['apple']: 'red',
      ['banana']: 'yellow',
      ['orange']: 'orange',
    });
    expect(DataConverter.toData(innerObject.getObject())).toEqual({
      ['apple']: 'red',
      ['banana']: 'yellow',
      ['orange']: 'orange',
    });
    expect(mockGet.mock.calls.length).toBe(1);
    expect(mockExeSubscription.mock.calls.length).toBe(1);
    expect(mockRollBack.mock.calls.length).toBe(1);
    mockGet.mockRestore();
    mockExeSubscription.mockRestore();
    mockRollBack.mockRestore();
  });

  test('delete test', () => {
    const hierarchy = new Hierarchy(5);
    const innerObject = new InnerObject({}, '', 10);
    innerObject.set(5);
    const mockGet = jest
      .spyOn(Hierarchy.prototype as any, 'get')
      .mockReturnValue(innerObject);
    const mockRollBack = jest.spyOn(innerObject, 'rollBack');
    hierarchy.delete(['', 'apple', 'color']);
    expect(DataConverter.toData(innerObject.getObject())).toEqual(null);
    expect(mockGet.mock.calls.length).toBe(1);
    expect(mockRollBack.mock.calls.length).toBe(1);
    mockGet.mockRestore();
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
