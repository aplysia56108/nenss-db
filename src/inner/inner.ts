import Node from '../node';
import Leaf from '../leaf';

class Inner<T, U> extends Node<T, U> {
  children: (Inner<T, U> | Leaf<T, U> | null)[];
  constructor(order: number) {
    super(order);
    this.order = order;
    this.halfOrder = Math.floor((order + 1) / 2);
    this.children = new Array(order);
  }

  clear(): void {
    this.parent = null;
    for (let j = 0; j <= this.numberOfKey; j++) {
      const child = this.getChild(j);
      if (!(child instanceof Leaf)) {
        child.clear();
      }
    }
  }

  getChild(i: number): Inner<T, U> | Leaf<T, U> {
    const child = this.children[i];
    if (child !== null) {
      return child;
    } else {
      throw Error('null child referred.');
    }
  }

  unite(child: Inner<T, U> | Leaf<T, U>, i: number) {
    this.children[i] = child;
    child.parent = this;
    child.position = i;
    this.partSize += child.partSize;
  }

  release(i: number) {
    const child = this.getChild(i);
    this.children[i] = null;
    this.partSize -= child.partSize;
    return child;
  }

  balanceWhenInserting(
    i: number,
    key: T,
    right: Inner<T, U> | Leaf<T, U>,
  ): void {
    if (this.numberOfKey === this.order - 1) {
      const newRight = new Inner<T, U>(this.order);
      let newKey;
      if (i < this.halfOrder - 1) {
        newKey = this.keys[this.halfOrder - 2];
        newRight.fullImmigrate(this, this.halfOrder - 1, 0);
        this.numberOfKey--;
        this.halfRightShift(i);
        this.keys[i] = key;
        this.children[i + 1] = right;
        right.parent = this;
        right.position = i + 1;
      } else if (i === this.halfOrder - 1) {
        newKey = key;
        newRight.halfImmigrate(this, i, 0);
        newRight.unite(right, 0);
        this.partSize -= right.partSize;
      } else {
        newKey = this.keys[this.halfOrder - 1];
        newRight.halfImmigrate(this, i, i - this.halfOrder + 1);
        newRight.keys[i - this.halfOrder] = key;
        newRight.numberOfKey++;
        newRight.unite(right, i - this.halfOrder + 1);
        newRight.fullImmigrate(this, this.halfOrder, 0);
        this.numberOfKey--;
        this.partSize -= right.partSize;
      }
      this.partSize++;
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
    this.halfRightShift(i);
    right.parent = this;
    right.position = i + 1;
    this.keys[i] = key;
    this.children[i + 1] = right;
    this.partSizeIncrement();
  }

  balanceWhenErasing(i: number): void {
    if (this.getChild(i).numberOfKey >= this.halfOrder - 1) {
      this.partSizeDecrement();
      return;
    }
    const parent = this.parent;
    let left;
    let right;
    if (i === 0) {
      left = this.getChild(0);
      right = this.getChild(1);
    } else {
      left = this.getChild(i - 1);
      right = this.getChild(i);
    }
    if (left instanceof Leaf || right instanceof Leaf) {
      return;
    }
    if (left.numberOfKey + right.numberOfKey === this.order - 2) {
      this.uniteLeftRight(left.position);
      this.partSize--;
      if (parent === null) {
        return;
      }
      parent.balanceWhenErasing(this.position);
      return;
    }
    if (left.numberOfKey < right.numberOfKey) {
      left.keys[left.numberOfKey] = this.keys[left.position];
      this.keys[left.position] = right.keys[0];
      left.numberOfKey++;
      left.unite(right.release(0), left.numberOfKey);
      right.fullLeftShift();
      this.partSizeDecrement();
      return;
    }
    right.fullRightShift();
    right.keys[0] = this.keys[left.position];
    right.unite(left.release(left.numberOfKey), 0);
    this.keys[left.position] = left.keys[left.numberOfKey - 1];
    left.numberOfKey--;
    this.partSizeDecrement();
    return;
  }

  leafBalanceWhenErasing(i: number): void {
    if (this.getChild(i).numberOfKey >= this.halfOrder - 1) {
      this.partSizeDecrement();
      return;
    }
    const parent = this.parent;
    let left;
    let right;
    if (i === 0) {
      left = this.getChild(0);
      right = this.getChild(1);
    } else {
      left = this.getChild(i - 1);
      right = this.getChild(i);
    }
    if (left instanceof Inner || right instanceof Inner) {
      return;
    }
    if (left.numberOfKey + right.numberOfKey === this.order - 2) {
      this.leafUniteLeftRight(left.position);
      this.partSize--;
      if (parent === null) {
        return;
      }
      parent.balanceWhenErasing(this.position);
      return;
    }
    if (left.numberOfKey < right.numberOfKey) {
      this.keys[left.position] = right.keys[0];
      left.keys[left.numberOfKey] = right.keys[0];
      left.items[left.numberOfKey] = right.items[0];
      left.numberOfKey++;
      left.partSize++;
      right.leftShift();
      right.partSize--;
      this.partSizeDecrement();
      return;
    }
    this.keys[left.position] = left.keys[left.numberOfKey - 2];
    right.rightShift();
    right.keys[0] = left.keys[left.numberOfKey - 1];
    right.items[0] = left.items[left.numberOfKey - 1];
    right.partSize++;
    left.numberOfKey--;
    left.partSize--;
    this.partSizeDecrement();
    return;
  }

  uniteLeftRight(i: number): void {
    const left = this.getChild(i);
    const right = this.getChild(i + 1);
    if (left instanceof Leaf || right instanceof Leaf) {
      return;
    }
    left.keys[left.numberOfKey] = this.keys[i];
    left.numberOfKey++;
    left.allImmigrate(right);
    this.halfLeftShift(i + 1);
    return;
  }

  leafUniteLeftRight(i: number): void {
    const left = this.getChild(i);
    const right = this.getChild(i + 1);
    if (left instanceof Inner || right instanceof Inner) {
      return;
    }
    left.next = right.next;
    if (left.next !== null) left.next.prev = left;
    left.allImmigrate(right);
    this.halfLeftShift(i + 1);
    return;
  }

  halfImmigrate(
    preInner: Inner<T, U>,
    preIndex: number,
    postIndex: number,
  ): void {
    for (let j = preIndex; j < preInner.numberOfKey; j++) {
      this.keys[postIndex + j - preIndex] = preInner.keys[j];
      this.unite(preInner.release(j + 1), postIndex + j - preIndex + 1);
    }
    if (preInner.numberOfKey - preIndex > 0) {
      this.numberOfKey += preInner.numberOfKey - preIndex;
      preInner.numberOfKey -= preInner.numberOfKey - preIndex;
    }
  }

  fullImmigrate(
    preInner: Inner<T, U>,
    preIndex: number,
    postIndex: number,
  ): void {
    this.unite(preInner.release(preIndex), postIndex);
    this.halfImmigrate(preInner, preIndex, postIndex);
  }

  allImmigrate(preInner: Inner<T, U>) {
    this.fullImmigrate(preInner, 0, this.numberOfKey);
  }

  halfLeftShift(i = 1): void {
    for (let j = i; j < this.numberOfKey; j++) {
      this.keys[j - 1] = this.keys[j];
      this.getChild(j + 1).position--;
      this.children[j] = this.children[j + 1];
    }
    this.children[this.numberOfKey] = null;
    this.numberOfKey--;
  }

  fullLeftShift(i = 1): void {
    this.getChild(i).position--;
    this.children[i - 1] = this.children[i];
    this.halfLeftShift(i);
  }

  halfRightShift(i = 0): void {
    for (let j = this.numberOfKey - 1; j >= i; j--) {
      this.keys[j + 1] = this.keys[j];
      this.getChild(j + 1).position++;
      this.children[j + 2] = this.children[j + 1];
    }
    this.children[i + 1] = null;
    this.numberOfKey++;
  }

  fullRightShift(i = 0): void {
    this.halfRightShift(i);
    this.getChild(i).position++;
    this.children[i + 1] = this.children[i];
  }
}

export default Inner;
