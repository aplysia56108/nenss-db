import BPlusTree from '../b-plus-tree';
import { Snapshot } from '../snapshot';
import { Data, ISubscriptions } from '../common/type-defs';

/* eslint-disable @typescript-eslint/no-explicit-any */

class InnerObject {
  private object: BPlusTree<string, InnerObject> | number | string | boolean;
  private parent: InnerObject | null;
  private ref: string;
  private name: string;
  private order;
  private subscriptions: ISubscriptions;
  constructor(
    subscriptions: ISubscriptions,
    name: string,
    order: number,
    parent: InnerObject | null = null,
  ) {
    this.order = order;
    this.object = new BPlusTree<string, InnerObject>(order);
    this.subscriptions = subscriptions;
    this.parent = parent;
    if (parent === null) {
      this.ref = '/';
    } else {
      if (parent.ref === '/') {
        this.ref = '';
      } else {
        this.ref = parent.ref;
      }
      this.ref += '/' + name;
    }
    this.name = name;
  }
  public getObject() {
    return this.object;
  }
  public setObject(
    object: BPlusTree<string, InnerObject> | number | string | boolean,
  ) {
    this.object = object;
  }

  public set(data: Data | null) {
    if (data === null) {
      this.delete();
      return;
    }
    if (typeof data === 'object') {
      if (this.object instanceof BPlusTree) {
        this.setObject(new BPlusTree<string, InnerObject>(this.order));
      }
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        this.push(keys[i], data[keys[i]]);
      }
    } else {
      if (this.object instanceof BPlusTree) {
        while (this.object.size() > 0) {
          this.object.begin().getItem().delete();
        }
      }
      this.setObject(data);
    }
    this.exeSubscription();
  }

  public push(ref: string, data: Data | null) {
    if (!(this.object instanceof BPlusTree)) {
      this.setObject(new BPlusTree<string, InnerObject>(this.order));
    }
    if (this.object instanceof BPlusTree) {
      this.object
        .push(
          ref,
          new InnerObject(this.subscriptions, ref, this.order, this),
        )[1]
        .getItem()
        .set(data);
    }
  }

  public delete() {
    if (this.object instanceof BPlusTree) {
      while (this.object.size() > 0) {
        this.object.begin().getItem().delete();
      }
    }
    if (this.parent !== null) {
      const dir = this.parent.getObject();
      if (dir instanceof BPlusTree) {
        dir.erase(this.name);
      }
    }
    this.exeSubscription();
  }

  public rollBack() {
    if (this.parent === null) {
      return;
    }
    if (this.object instanceof BPlusTree) {
      if (this.object.size() === 0) {
        this.delete();
        this.parent.rollBack();
        return;
      }
      this.exeSubscription();
      this.parent.rollBack();
    }
  }

  exeSubscription<T = any>() {
    const callbacks = this.subscriptions[this.ref];
    if (callbacks === undefined) {
      return;
    }
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i](new Snapshot<T>(this));
    }
  }
}

export default InnerObject;
