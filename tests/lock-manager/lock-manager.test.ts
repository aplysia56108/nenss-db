import LockManager from '../../src/lock-manager';
import Query from '../../src/query';
import {
  UnexpectedNullIdError,
  UnexpectedWrongIdToExecuteWriteError,
  TaskIsStackingError,
} from '../../src/common/error';

/* eslint-disable @typescript-eslint/no-explicit-any */
const doSomething = () => {
  return new Promise<void>(() => {
    return;
  });
};

test('lockingRefIterator test', () => {
  const lockManager = new LockManager() as any;
  lockManager.lockedQueryLists.insert('/apple/color', []);
  lockManager.lockedQueryLists.insert('/orange', []);
  lockManager.lockedQueryLists.insert('/banana/color/yellow', []);
  expect(lockManager.lockingRefIterator('/').getKey()).toEqual('/apple/color');
  expect(lockManager.lockingRefIterator('/peach')).toEqual(null);
  expect(lockManager.lockingRefIterator('/orange/color').getKey()).toEqual(
    '/orange',
  );
  expect(lockManager.lockingRefIterator('/banana/color').getKey()).toEqual(
    '/banana/color/yellow',
  );
});

test('assort and execute and release test', async () => {
  const mockFunction = jest.fn(doSomething);
  const lockManager = new LockManager(1);
  const query1 = new Query(mockFunction, '/');
  const query2 = new Query(mockFunction, '/peach');
  const query3 = new Query(mockFunction, '/orange', 'read', 'a');
  const query4 = new Query(mockFunction, '/orange', 'write', 'b');
  const query5 = new Query(mockFunction, '/orange', 'write', 'a');
  const query6 = new Query(mockFunction, '/orange', 'read', null);
  await lockManager.assort(query1);
  expect(mockFunction.mock.calls.length).toBe(1);
  await lockManager.assort(query2);
  expect(mockFunction.mock.calls.length).toBe(2);
  await lockManager.assort(query3);
  await lockManager.assort(query1);
  expect(mockFunction.mock.calls.length).toBe(3);
  await lockManager.assort(query2);
  expect(mockFunction.mock.calls.length).toBe(4);
  try {
    await lockManager.assort(query1);
  } catch (e) {
    expect(e.message).toBe(new TaskIsStackingError().message);
  }
  try {
    await lockManager.assort(query4);
  } catch (e) {
    expect(e.message).toBe(new UnexpectedWrongIdToExecuteWriteError().message);
  }
  await lockManager.assort(query5);
  expect(mockFunction.mock.calls.length).toBe(6);
  try {
    await lockManager.assort(query6);
  } catch (e) {
    expect(e.message).toBe(new UnexpectedNullIdError().message);
  }
});
