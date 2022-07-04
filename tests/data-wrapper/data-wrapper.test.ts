import BPlusTree from '../../src/b-plus-tree';
import InnerObject from '../../src/inner-object';
import { nullData } from '../../src/common/types';
import DataWrapper from '../../src/data-wrapper';

test('nullData test', () => {
  const dataWrapper = new DataWrapper();
  dataWrapper.setData(nullData);
  expect(dataWrapper.getData()).toEqual(nullData);
});

test('value test', () => {
  const dataWrapper = new DataWrapper();
  dataWrapper.setData(1);
  expect(dataWrapper.getData()).toEqual(1);
});

test('tree test', () => {
  const dataWrapper = new DataWrapper();
  const tree = new BPlusTree<string, InnerObject>();
  dataWrapper.setData(tree);
  expect(dataWrapper.getData()).toEqual(tree);
});
