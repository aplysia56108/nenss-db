import Inner from '../inner';

class Node<T, U> {
  keys: T[];
  numberOfKey;
  partSize;
  parent: Inner<T, U> | null;
  position;
  order;
  halfOrder;
  constructor(order: number) {
    this.order = order;
    this.halfOrder = Math.floor((order + 1) / 2);
    this.keys = new Array(order - 1);
    this.numberOfKey = 0;
    this.partSize = 0;
    this.parent = null;
    this.position = -1;
  }

  // binarySearch
  lowerBound(key: T) {
    let l = 0;
    let r = this.numberOfKey - 1;
    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      if (this.keys[mid] < key) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
    return l;
  }

  partSizeIncrement() {
    this.partSize++;
    if (this.parent === null) {
      return;
    }
    this.parent.partSizeIncrement();
  }

  partSizeDecrement() {
    this.partSize--;
    if (this.parent === null) {
      return;
    }
    this.parent.partSizeDecrement();
  }
}

export default Node;
