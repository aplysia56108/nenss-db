import BPlusTree from '../../src/b-plus-tree';
import InnerObject from '../../src/inner-object';
import Iterator from '../../src/iterator';
import { Snapshot } from '../../src/snapshot';
import { Data } from '../../src/common/types';
import DataConverter from '../../src/common/data-converter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callback = <T = any>(_snapshot: Snapshot<T>): void => {
  return;
};

describe('innerObject test', () => {
  test('getObject test', () => {
    const innerObject = new InnerObject({}, '', 5);
    expect(innerObject.getObject()).toEqual(
      new BPlusTree<string, InnerObject>(5),
    );
  });

  test('setObject test', () => {
    const innerObject = new InnerObject({}, '', 5);
    innerObject.setObject(5);
    expect(innerObject.getObject()).toEqual(5);
  });

  describe('set test', () => {
    test('null test', () => {
      const innerObject = new InnerObject({}, '', 5);
      const mockDelete = jest
        .spyOn(innerObject, 'delete')
        .mockImplementation(() => {
          return;
        });
      innerObject.set(null);
      expect(mockDelete.mock.calls.length).toBe(1);
      mockDelete.mockRestore();
    });

    test('string test', () => {
      const innerObject = new InnerObject({}, '', 5);
      const iterator = new Iterator<string, InnerObject>(null, -1);
      const mockExeSubscription = jest.spyOn(innerObject, 'exeSubscription');
      const mockSize = jest
        .spyOn(BPlusTree.prototype, 'size')
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(0);
      const mockBegin = jest
        .spyOn(BPlusTree.prototype, 'begin')
        .mockReturnValue(iterator);
      const mockGetItem = jest
        .spyOn(Iterator.prototype, 'getItem')
        .mockReturnValue(innerObject);
      const mockDelete = jest
        .spyOn(InnerObject.prototype, 'delete')
        .mockImplementation(() => {
          return;
        });
      innerObject.set('test');
      expect(mockExeSubscription.mock.calls.length).toBe(1);
      expect(mockDelete.mock.calls.length).toBe(3);
      expect(innerObject.getObject()).toBe('test');
      mockExeSubscription.mockRestore();
      mockDelete.mockRestore();
      mockGetItem.mockRestore();
      mockSize.mockRestore();
      mockBegin.mockRestore();
    });

    test('object to tree test', () => {
      const innerObject = new InnerObject({}, '', 5);
      const object = new BPlusTree<string, InnerObject>(10);
      const input: Data = {};
      input['number'] = 5;
      input['boolean'] = false;
      input['string'] = 'test';
      const mockExeSubscription = jest.spyOn(innerObject, 'exeSubscription');
      const mockPush = jest
        .spyOn(InnerObject.prototype, 'push')
        .mockImplementation((key: string) => {
          return input[key];
        });
      innerObject.setObject(object);
      innerObject.set(input);
      expect(mockExeSubscription.mock.calls.length).toBe(1);
      expect(mockPush.mock.calls.length).toBe(3);
      expect(mockPush.mock.calls[0][0]).toBe('number');
      expect(mockPush.mock.calls[1][0]).toBe('boolean');
      expect(mockPush.mock.calls[2][0]).toBe('string');
      expect(mockPush.mock.results[0].value).toBe(5);
      expect(mockPush.mock.results[1].value).toBe(false);
      expect(mockPush.mock.results[2].value).toBe('test');
      expect(innerObject.getObject()).toEqual(
        new BPlusTree<string, InnerObject>(5),
      );
      mockExeSubscription.mockRestore();
      mockPush.mockRestore();
    });

    test('object to value test', () => {
      const innerObject = new InnerObject({}, '', 5);
      const object = 5;
      const input: Data = {};
      input['number'] = 5;
      input['boolean'] = false;
      input['string'] = 'test';
      innerObject.setObject(object);
      const mockSetObject = jest.spyOn(innerObject, 'setObject');
      const mockExeSubscription = jest.spyOn(innerObject, 'exeSubscription');
      const mockPush = jest
        .spyOn(InnerObject.prototype, 'push')
        .mockImplementation((key: string) => {
          return input[key];
        });
      innerObject.set(input);
      expect(mockExeSubscription.mock.calls.length).toBe(1);
      expect(mockPush.mock.calls.length).toBe(3);
      expect(mockPush.mock.calls[0][0]).toBe('number');
      expect(mockPush.mock.calls[1][0]).toBe('boolean');
      expect(mockPush.mock.calls[2][0]).toBe('string');
      expect(mockPush.mock.results[0].value).toBe(5);
      expect(mockPush.mock.results[1].value).toBe(false);
      expect(mockPush.mock.results[2].value).toBe('test');
      expect(mockSetObject.mock.calls.length).toEqual(0);
      mockSetObject.mockRestore();
      mockExeSubscription.mockRestore();
      mockPush.mockRestore();
    });
  });

  describe('push test', () => {
    test('to value test', () => {
      const innerObject = new InnerObject({}, '', 5);
      const object = 5;
      const input: Data = {};
      input['number'] = 5;
      input['boolean'] = false;
      input['string'] = 'test';
      innerObject.setObject(object);
      const mockSetObject = jest.spyOn(innerObject, 'setObject');
      const ref = 'ref';
      const mockSet = jest
        .spyOn(InnerObject.prototype, 'set')
        .mockImplementation((input) => {
          input;
          return;
        });

      innerObject.push(ref, input);
      expect(mockSetObject.mock.calls.length).toBe(1);
      expect(mockSet.mock.calls.length).toBe(1);
      expect(mockSet.mock.calls[0][0]).toEqual(input);
      mockSetObject.mockRestore();
      mockSet.mockRestore();
    });

    test('to tree test', () => {
      const innerObject = new InnerObject({}, '', 5);
      const input: Data = {};
      input['number'] = 5;
      input['boolean'] = false;
      input['string'] = 'test';
      const mockSetObject = jest.spyOn(innerObject, 'setObject');
      const ref = 'ref';
      const mockSet = jest
        .spyOn(InnerObject.prototype, 'set')
        .mockImplementation((input) => {
          input;
          return;
        });

      innerObject.push(ref, input);
      expect(mockSetObject.mock.calls.length).toBe(0);
      expect(mockSet.mock.calls.length).toBe(1);
      expect(mockSet.mock.calls[0][0]).toEqual(input);
      mockSetObject.mockRestore();
      mockSet.mockRestore();
    });
  });

  describe('set and push test', () => {
    const innerObject = new InnerObject({}, '', 5);
    const object: Data = {
      ['boolean']: true,
      ['string']: 'test',
      ['number']: 0,
      ['object']: {
        ['key']: 'item',
        ['null']: null,
      },
    };
    innerObject.set(object);
    const output: Data = {
      ['boolean']: true,
      ['string']: 'test',
      ['number']: 0,
      ['object']: {
        ['key']: 'item',
      },
    };
    expect(DataConverter.toData(innerObject)).toEqual(output);
  });

  describe('delete test', () => {
    test('delete test', () => {
      const innerObject = new InnerObject({}, '', 5);
      const iterator = new Iterator<string, InnerObject>(null, -1);
      const subInnerObject = new InnerObject({}, 'sub', 5, innerObject);
      subInnerObject.setObject(5);
      const mockExeSubscription1 = jest.spyOn(innerObject, 'exeSubscription');
      const mockExeSubscription2 = jest.spyOn(
        subInnerObject,
        'exeSubscription',
      );
      const mockSize = jest
        .spyOn(BPlusTree.prototype, 'size')
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(0);
      const mockBegin = jest
        .spyOn(BPlusTree.prototype, 'begin')
        .mockReturnValue(iterator);
      const mockGetItem = jest
        .spyOn(Iterator.prototype, 'getItem')
        .mockReturnValue(subInnerObject);
      const mockErase = jest.spyOn(BPlusTree.prototype, 'erase');
      const mockDelete1 = jest.spyOn(innerObject, 'delete');
      const mockDelete2 = jest.spyOn(subInnerObject, 'delete');
      innerObject.delete();
      expect(mockErase.mock.calls.length).toBe(3);
      expect(mockExeSubscription1.mock.calls.length).toBe(1);
      expect(mockExeSubscription2.mock.calls.length).toBe(3);
      expect(mockDelete1.mock.calls.length).toBe(1);
      expect(mockDelete2.mock.calls.length).toBe(3);
      expect(mockErase.mock.calls[0][0]).toBe('sub');
      expect(mockErase.mock.calls[1][0]).toBe('sub');
      expect(mockErase.mock.calls[2][0]).toBe('sub');
      mockExeSubscription1.mockRestore();
      mockDelete1.mockRestore();
      mockExeSubscription2.mockRestore();
      mockDelete2.mockRestore();
      mockGetItem.mockRestore();
      mockSize.mockRestore();
      mockBegin.mockRestore();
      mockErase.mockRestore();
    });
  });

  describe('rollBack test', () => {
    test('null test', () => {
      const innerObject = new InnerObject({}, '', 5);
      const mockRollBack = jest.spyOn(InnerObject.prototype, 'rollBack');
      const mockExeSubscription = jest.spyOn(
        InnerObject.prototype,
        'exeSubscription',
      );
      innerObject.rollBack();
      expect(mockRollBack.mock.calls.length).toBe(1);
      expect(mockExeSubscription.mock.calls.length).toBe(0);
      mockExeSubscription.mockRestore();
      mockRollBack.mockRestore();
    });

    test('size 0 test', () => {
      const innerObject = new InnerObject({}, '', 5);
      const subInnerObject = new InnerObject({}, 'sub', 5, innerObject);
      const mockExeSubscription1 = jest.spyOn(innerObject, 'exeSubscription');
      const mockExeSubscription2 = jest.spyOn(
        subInnerObject,
        'exeSubscription',
      );
      const mockRollBack1 = jest.spyOn(innerObject, 'rollBack');
      const mockRollBack2 = jest.spyOn(subInnerObject, 'rollBack');
      const mockDelete = jest
        .spyOn(InnerObject.prototype, 'delete')
        .mockImplementation(() => {
          return;
        });
      subInnerObject.rollBack();
      expect(mockRollBack1.mock.calls.length).toBe(1);
      expect(mockExeSubscription1.mock.calls.length).toBe(0);
      expect(mockRollBack2.mock.calls.length).toBe(1);
      expect(mockExeSubscription2.mock.calls.length).toBe(0);
      expect(mockDelete.mock.calls.length).toBe(1);
      mockExeSubscription1.mockRestore();
      mockRollBack1.mockRestore();
      mockExeSubscription2.mockRestore();
      mockRollBack2.mockRestore();
      mockDelete.mockRestore();
    });

    test('data test', () => {
      const innerObject = new InnerObject({}, '', 5);
      const subInnerObject = new InnerObject({}, 'sub', 5, innerObject);
      const mockExeSubscription1 = jest.spyOn(innerObject, 'exeSubscription');
      const mockExeSubscription2 = jest.spyOn(
        subInnerObject,
        'exeSubscription',
      );
      const mockRollBack1 = jest.spyOn(innerObject, 'rollBack');
      const mockRollBack2 = jest.spyOn(subInnerObject, 'rollBack');
      const mockDelete = jest
        .spyOn(InnerObject.prototype, 'delete')
        .mockImplementation(() => {
          return;
        });
      const mockSize = jest
        .spyOn(BPlusTree.prototype, 'size')
        .mockReturnValue(1);
      subInnerObject.rollBack();
      expect(mockRollBack1.mock.calls.length).toBe(1);
      expect(mockExeSubscription1.mock.calls.length).toBe(1);
      expect(mockRollBack2.mock.calls.length).toBe(1);
      expect(mockExeSubscription2.mock.calls.length).toBe(0);
      expect(mockDelete.mock.calls.length).toBe(0);
      mockExeSubscription1.mockRestore();
      mockRollBack1.mockRestore();
      mockExeSubscription2.mockRestore();
      mockRollBack2.mockRestore();
      mockDelete.mockRestore();
      mockSize.mockRestore();
    });
  });

  describe('exeSubscription test', () => {
    test('test', () => {
      const subscription = jest.fn(callback);
      const subscriptions = {
        ['/']: [subscription, subscription, subscription],
        ['/apple']: [subscription, subscription],
        ['/apple/orange']: [subscription],
      };
      const innerObject1 = new InnerObject(subscriptions, '', 5);
      innerObject1.exeSubscription();
      expect(subscription.mock.calls.length).toBe(3);
      const innerObject2 = new InnerObject(
        subscriptions,
        'apple',
        5,
        innerObject1,
      );
      innerObject2.exeSubscription();
      expect(subscription.mock.calls.length).toBe(5);
      const innerObject3 = new InnerObject(
        subscriptions,
        'banana',
        5,
        innerObject2,
      );
      innerObject3.exeSubscription();
      expect(subscription.mock.calls.length).toBe(5);
    });
  });
});
