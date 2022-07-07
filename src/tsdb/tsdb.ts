import BPlusTree from '../b-plus-tree';
import Hierarchy from '../hierarchy';
import LockManager from '../lock-manager';
import Query from '../query';
import ITsdb from '../tsdb/i-tsdb';
import DataConverter from '../common/data-converter';
import RefChecker from '../common/ref-checker';
import UniqueKey from '../common/unique-key';
import { Snapshot } from '../snapshot';
import { Data } from '../common/types';
import DataWrapper from '../data-wrapper';

/* eslint-disable @typescript-eslint/no-explicit-any */

class Tsdb implements ITsdb {
  private db: Hierarchy;
  private lockManager: LockManager;
  constructor(
    order = BPlusTree.defaultOrder,
    maxPending = LockManager.maxPending,
  ) {
    this.db = new Hierarchy(order);
    this.lockManager = new LockManager(maxPending);
  }

  private async search(refArray: string[], data: DataWrapper) {
    data.setData(this.db.search(refArray));
  }

  public async get<T = any>(ref: string) {
    const refArray = RefChecker.toRefArray(ref);
    const data = new DataWrapper();
    this.lockManager.assort(new Query(() => this.search(refArray, data), ref));
    return new Snapshot<T>(data.getData());
  }

  public async set<T = any>(ref: string, data: T) {
    const refArray = RefChecker.toRefArray(ref);
    const innerData = DataConverter.toInnerData(data);
    this.lockManager.assort(
      new Query(() => this.db.set(refArray, innerData), ref),
    );
  }

  public async delete(ref: string) {
    const refArray = RefChecker.toRefArray(ref);
    this.lockManager.assort(new Query(() => this.db.delete(refArray), ref));
  }

  public async push<T = any>(ref: string, data: T, key?: string) {
    const refArray = RefChecker.toRefArray(ref);
    const innerData = DataConverter.toInnerData(data);
    let newKey: string;
    if (key === undefined) {
      newKey = UniqueKey.generate();
    } else {
      newKey = key;
    }
    this.lockManager.assort(
      new Query(() => this.db.push(refArray, innerData, newKey), ref),
    );
    // in this arrange, key can be returned before data is pushed.
    return newKey;
  }

  public async update<T = any>(ref: string, data: Partial<T>) {
    const refArray = RefChecker.toRefArray(ref);
    const innerData = DataConverter.toInnerData(data) as {
      [key: string]: Data;
    };
    this.lockManager.assort(
      new Query(() => this.db.update(refArray, innerData), ref),
    );
  }

  public subscribe<T>(
    ref: string,
    callback: (data: Snapshot<T>) => void,
  ): string {
    const id = UniqueKey.generate();
    this.db.subscribe(ref, id, callback);
    return id;
  }

  public unsubscribe(id?: string): void {
    if (id === undefined) {
      this.db.clearSubscriptions();
      return;
    }
    this.db.unsubscribe(id);
  }
}

export default Tsdb;
