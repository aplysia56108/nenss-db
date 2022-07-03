import BPlusTree from '../../../src/b-plus-tree';
import InnerObject from '../../../src/inner-object';
import DataConverter from '../../../src/common/data-converter';
import Iterator from '../../../src/iterator';
import { UnexpectedDataTypeToInsertError } from '../../../src/common/error';
import { Data } from '../../../src/common/type-defs';

describe('toInerData test', () => {
  test('null test', () => {
    const data = DataConverter.toInnerData(null);
    expect(data).toBe(null);
  });

  test('undefined test', () => {
    expect(() => DataConverter.toInnerData(undefined)).toThrow();
    expect(() => DataConverter.toInnerData(undefined)).toThrow(
      new UnexpectedDataTypeToInsertError(typeof undefined),
    );
  });

  test('string test', () => {
    const data = DataConverter.toInnerData('test');
    expect(data).toBe('test');
  });

  test('boolean test', () => {
    const data = DataConverter.toInnerData(true);
    expect(data).toBe(true);
  });

  test('number test', () => {
    const data = DataConverter.toInnerData(5);
    expect(data).toBe(5);
  });

  test('number test', () => {
    const data = DataConverter.toInnerData(5);
    expect(data).toBe(5);
  });

  test('list test', () => {
    const input = [3, true, 'test'];
    const data = DataConverter.toInnerData(input);
    const output: Data = {};
    output[0] = 3;
    output[1] = true;
    output[2] = 'test';
    expect(data).toEqual(output);
  });

  test('object test', () => {
    const input = {
      number: 1,
      boolean: false,
      string: 'test',
      object: { key: 'item' },
    };
    const data = DataConverter.toInnerData(input);
    const output: Data = {};
    output['number'] = 1;
    output['boolean'] = false;
    output['string'] = 'test';
    output['object'] = { ['key']: 'item' };
    expect(data).toEqual(output);
  });
});

describe('toData test', () => {
  test('null test', () => {
    const object = InnerObject.prototype;
    const obj = new BPlusTree<string, InnerObject>();
    const mockGetObject = jest.spyOn(object, 'getObject').mockReturnValue(obj);
    const mockSize = jest.spyOn(obj, 'size').mockReturnValue(0);
    expect(DataConverter.toData(object)).toEqual(null);
    mockGetObject.mockRestore();
    mockSize.mockRestore();
  });

  test('string test', () => {
    const object = InnerObject.prototype;
    const obj = 'test';
    const mockGetObject = jest.spyOn(object, 'getObject').mockReturnValue(obj);
    expect(DataConverter.toData(object)).toEqual('test');
    mockGetObject.mockRestore();
  });

  test('object test', () => {
    const object = InnerObject.prototype;
    const obj = new BPlusTree<string, InnerObject>();
    const iterator = Iterator.prototype;
    const mockGetObject = jest
      .spyOn(object, 'getObject')
      .mockReturnValueOnce(obj)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce('test');
    const mockSize = jest.spyOn(obj, 'size').mockReturnValue(3);
    const mockBegin = jest.spyOn(obj, 'begin').mockReturnValue(iterator);
    const mockNext = jest
      .spyOn(iterator, 'next')
      .mockImplementation(() => true);
    jest
      .spyOn(iterator, 'getKey')
      .mockReturnValueOnce('number')
      .mockReturnValueOnce('boolean')
      .mockReturnValueOnce('string');
    jest.spyOn(iterator, 'getItem').mockReturnValue(object);
    const output: Data = {};
    output['number'] = 5;
    output['boolean'] = false;
    output['string'] = 'test';
    const data = DataConverter.toData(object);
    expect(data).toEqual(output);
    expect(mockNext.mock.calls.length).toBe(3);
    mockGetObject.mockRestore();
    mockBegin.mockRestore();
    mockNext.mockRestore();
    mockSize.mockRestore();
  });
});
