import RefChecker from '../common/ref-checker';
import BPlusTree from '../b-plus-tree';
import Iterator from '../iterator';
import Query from '../query';
import {
  UnexpectedNullIdError,
  UnexpectedWrongIdToExecuteWriteError,
  TaskIsStackingError,
} from '../common/error';

class LockManager {
  private lockedQueryLists: BPlusTree<string, Query[]>;
  private lockedRefs: { [id: string]: string } = {};
  private maxPending: number;
  static maxPending = 1000;
  constructor(maxPending = LockManager.maxPending) {
    this.lockedQueryLists = new BPlusTree<string, Query[]>();
    this.maxPending = maxPending;
  }

  private lockingRefIterator(ref: string): Iterator<string, Query[]> | null {
    const backIterator = this.lockedQueryLists.lowerBound(ref);
    const frontIterator = this.lockedQueryLists.upperBound(ref);
    frontIterator.prev();
    if (backIterator.isValid()) {
      const backRef = backIterator.getKey();
      if (RefChecker.isIncluded(backRef, ref)) {
        return backIterator;
      }
    }
    if (frontIterator.isValid()) {
      const frontRef = frontIterator.getKey();
      if (RefChecker.isIncluded(ref, frontRef)) {
        return frontIterator;
      }
    }
    return null;
  }

  private async execute(query: Query): Promise<void> {
    if (query.status === 'read-or-write') {
      this.lockedQueryLists.insert(query.ref, []);
      query.func();
      this.release(query.ref);
      return;
    }

    if (query.status === 'read') {
      this.lockedQueryLists.insert(query.ref, []);
      this.lockedRefs[query.id] = query.ref;
      query.func();
      return;
    }

    if (query.status === 'write') {
      query.func();
      delete this.lockedRefs[query.id];
      this.release(query.ref);
      return;
    }
  }

  private release(ref: string): void {
    const iterator = this.lockedQueryLists.search(ref);
    if (iterator !== null) {
      const queries = iterator.getItem();
      this.lockedQueryLists.erase(ref);
      for (let i = 0; i < queries.length; i++) {
        this.assort(queries[i]);
      }
    }
  }

  public async assort(query: Query): Promise<void> {
    if (query.status !== 'read-or-write' && query.id === null) {
      throw new UnexpectedNullIdError();
    }
    if (query.status === 'write') {
      if (this.lockedRefs[query.id] !== query.ref) {
        throw new UnexpectedWrongIdToExecuteWriteError();
      }
      this.execute(query);
      return;
    }
    const lockingIterator = this.lockingRefIterator(query.ref);
    if (lockingIterator === null) {
      this.execute(query);
      return;
    }
    const lockedQueries = lockingIterator.getItem();
    if (lockedQueries.length === this.maxPending)
      throw new TaskIsStackingError();
    lockedQueries.push(query);
  }
}

export default LockManager;
