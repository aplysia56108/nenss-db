import InnerObject from '../../src/inner-object';
import { NullData } from '../../src/common/types';
import { Snapshot } from '../../src/snapshot';

test('null test', () => {
  const innerObject = new InnerObject({}, '', 5);
  const snapshot = new Snapshot(innerObject.getObject());
  expect(snapshot.val()).toBe(null);
  expect(snapshot.exists()).toBe(false);
});

test('null test2', () => {
  const snapshot = new Snapshot(new NullData());
  expect(snapshot.val()).toBe(null);
  expect(snapshot.exists()).toBe(false);
});

test('value test', () => {
  const innerObject = new InnerObject({}, '', 5);
  innerObject.setObject(5);
  const snapshot = new Snapshot(innerObject.getObject());
  expect(snapshot.val()).toBe(5);
  expect(snapshot.exists()).toBe(true);
});
