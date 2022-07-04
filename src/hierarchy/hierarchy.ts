import BPlusTree from '../b-plus-tree';
import InnerObject from '../inner-object';
import {
  Data,
  Func,
  Subscriptions,
  nullData,
  InnerObjectData,
} from '../common/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

class Hierarchy {
  private homeDir;
  private order;
  private subscriptions: Subscriptions = {};
  private subscribedRefs: { [id: string]: string } = {};
  constructor(order = BPlusTree.defaultOrder) {
    this.homeDir = new InnerObject(this.subscriptions, '', order);
    this.order = order;
  }

  public getSubscriptions() {
    return this.subscriptions;
  }

  public search(refArray: string[]): InnerObjectData {
    let presentInnerObject: InnerObject = this.homeDir;
    for (let i = 1; i < refArray.length; i++) {
      const obj = presentInnerObject.getObject();
      if (!(obj instanceof BPlusTree)) {
        return nullData;
      }
      if (obj instanceof BPlusTree) {
        const innerObject = obj.search(refArray[i]);
        if (innerObject === null) {
          return nullData;
        }
        presentInnerObject = innerObject.getItem();
      }
    }
    return presentInnerObject.getObject();
  }

  private get(refArray: string[]): InnerObject {
    const depth = refArray.length;
    let presentInnerObject = this.homeDir;
    for (let i = 1; i < depth; i++) {
      const obj = presentInnerObject.getObject();
      if (!(obj instanceof BPlusTree)) {
        presentInnerObject.setObject(new BPlusTree(this.order));
      }
      if (obj instanceof BPlusTree) {
        presentInnerObject = obj
          .push(
            refArray[i],
            new InnerObject(
              this.subscriptions,
              refArray[i],
              this.order,
              presentInnerObject,
            ),
          )[1]
          .getItem();
      }
    }
    return presentInnerObject;
  }

  public async set(refArray: string[], data: Data | null) {
    const innerObject = this.get(refArray);
    innerObject.set(data);
    innerObject.rollBack();
  }

  public async push(refArray: string[], data: Data | null, key: string) {
    const innerObject = this.get(refArray);
    innerObject.push(key, data);
    innerObject.exeSubscription();
    innerObject.rollBack();
  }

  public async update(refArray: string[], data: { [key: string]: Data }) {
    const innerObject = this.get(refArray);
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      innerObject.push(key, data[key]);
    }
    innerObject.exeSubscription();
    innerObject.rollBack();
  }

  public async delete(refArray: string[]) {
    const innerObject = this.get(refArray);
    innerObject.delete();
    innerObject.rollBack();
  }

  public subscribe<T = any>(ref: string, id: string, callback: Func<T>) {
    this.subscribedRefs[id] = ref;
    if (!(ref in this.subscriptions)) {
      this.subscriptions[ref] = {};
    }
    this.subscriptions[ref][id] = callback;
  }

  public unsubscribe(id: string) {
    const ref = this.subscribedRefs[id];
    if (ref === undefined) {
      throw Error('invalid id to unsubscribe.');
    }
    delete this.subscribedRefs[id];
    delete this.subscriptions[ref][id];
    if (Object.keys(this.subscriptions[ref]).length === 0) {
      delete this.subscriptions[ref];
    }
  }

  public clearSubscriptions() {
    this.subscribedRefs = {};
    this.subscriptions = {};
  }
}

export default Hierarchy;
