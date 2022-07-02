import Node from 'src/node';
import Inner from 'src/inner';

class Leaf<T, U> extends Node<T, U> {
  keys: T[];
  items: (U | null)[];
  prev: Leaf<T, U> | null;
  next: Leaf<T, U> | null;
  constructor(order: number) {
    super(order);
    this.order = order;
    this.halfOrder = Math.floor((order + 1) / 2);
    this.keys = new Array(order - 1);
    this.items = new Array(order - 1);
    this.prev = null;
    this.next = null;
  }

  getKey(i: number): T {
    if (i < 0 || i >= this.numberOfKey) {
      throw Error('invalid iterator.');
    }
    const key = this.keys[i];
    return key;
  }

  getItem(i: number): U {
    if (i < 0 || i >= this.numberOfKey) {
      throw Error('invalid iterator.');
    }
    const item = this.items[i];
    if (item === null) {
      throw Error('unexpected null item.');
    }
    return item;
  }

  insert(i: number, key: T, item: U): void {
    if (this.numberOfKey === this.order - 1) {
      const newRight = new Leaf<T, U>(this.order);
      let newKey;
      if (i <= this.halfOrder - 1) {
        newRight.immigrate(this, this.halfOrder - 1, 0);
        this.rightShift(i);
        this.keys[i] = key;
        this.items[i] = item;
        this.partSize++;
        newKey = this.keys[this.halfOrder - 1];
      } else {
        newKey = this.keys[this.halfOrder - 1];
        newRight.immigrate(this, i, i - this.halfOrder + 1);
        newRight.keys[i - this.halfOrder] = key;
        newRight.items[i - this.halfOrder] = item;
        newRight.immigrate(this, this.halfOrder, 0);
        newRight.numberOfKey++;
        newRight.partSize++;
      }
      newRight.next = this.next;
      newRight.prev = this;
      if (this.next !== null) {
        this.next.prev = newRight;
      }
      this.next = newRight;
      if (this.parent === null) {
        const root = new Inner<T, U>(this.order);
        root.keys[0] = newKey;
        root.numberOfKey++;
        root.unite(this, 0);
        root.unite(newRight, 1);
        return;
      }
      this.parent.balanceWhenInserting(this.position, newKey, newRight);
      return;
    }
    this.rightShift(i);
    this.keys[i] = key;
    this.items[i] = item;
    this.partSizeIncrement();
    return;
  }

  erase(i: number) {
    this.leftShift(i + 1);
    const parent = this.parent;
    if (this.numberOfKey >= this.halfOrder - 1) {
      this.partSizeDecrement();
      return;
    }
    this.partSize--;
    if (parent === null) {
      return;
    }
    parent.leafBalanceWhenErasing(this.position);
    return;
  }

  immigrate(preLeaf: Leaf<T, U>, preIndex: number, postIndex: number) {
    for (let j = preIndex; j < preLeaf.numberOfKey; j++) {
      this.keys[postIndex + j - preIndex] = preLeaf.keys[j];
      this.items[postIndex + j - preIndex] = preLeaf.items[j];
      preLeaf.items[j] = null;
    }
    if (preLeaf.numberOfKey - preIndex > 0) {
      this.numberOfKey += preLeaf.numberOfKey - preIndex;
      preLeaf.numberOfKey -= preLeaf.numberOfKey - preIndex;
      this.partSize += preLeaf.partSize - preIndex;
      preLeaf.partSize -= preLeaf.partSize - preIndex;
    }
  }

  allImmigrate(preLeaf: Leaf<T, U>) {
    this.immigrate(preLeaf, 0, this.numberOfKey);
  }

  leftShift(i = 1) {
    for (let j = i; j < this.numberOfKey; j++) {
      this.keys[j - 1] = this.keys[j];
      this.items[j - 1] = this.items[j];
    }
    this.numberOfKey--;
    this.items[this.numberOfKey] = null;
  }

  rightShift(i = 0) {
    for (let j = this.numberOfKey - 1; j >= i; j--) {
      this.keys[j + 1] = this.keys[j];
      this.items[j + 1] = this.items[j];
    }
    this.numberOfKey++;
  }
}

export default Leaf;
