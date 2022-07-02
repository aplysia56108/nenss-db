import Leaf from '../leaf';
import Inner from '../inner';

class Iterator<T, U> {
  private leaf: Leaf<T, U> | null;
  private position: number;
  constructor(leaf: Leaf<T, U>, position: number) {
    this.leaf = leaf;
    this.position = position;
    this.adjust();
  }

  private adjust(): void {
    if (this.leaf !== null) {
      if (this.leaf.numberOfKey <= this.position) {
        while (this.leaf.next !== null) {
          this.position -= this.leaf.numberOfKey;
          this.leaf = this.leaf.next;
          if (this.position < this.leaf.numberOfKey) {
            break;
          }
        }
      }
      if (this.position < 0) {
        while (this.leaf.prev !== null) {
          this.leaf = this.leaf.prev;
          this.position += this.leaf.numberOfKey;
          if (this.position >= 0) {
            break;
          }
        }
      }
    }
  }

  prev(): boolean {
    if (this.leaf === null) {
      return false;
    }
    if (this.position === 0 && this.leaf.prev !== null) {
      this.leaf = this.leaf.prev;
      this.position = this.leaf.numberOfKey - 1;
      return true;
    }
    this.position--;
    return this.position >= 0;
  }

  next(): boolean {
    if (this.leaf === null) {
      return false;
    }
    if (
      this.position === this.leaf.numberOfKey - 1 &&
      this.leaf.next !== null
    ) {
      this.leaf = this.leaf.next;
      this.position = 0;
      return true;
    }
    this.position++;
    return this.position < this.leaf.numberOfKey;
  }

  getKey(): T {
    if (this.leaf === null) {
      throw Error('invalid iterator.');
    }
    return this.leaf.getKey(this.position);
  }

  getItem(): U {
    if (this.leaf === null) {
      throw Error('invalid iterator.');
    }
    return this.leaf.getItem(this.position);
  }

  set(item: U): void {
    if (
      this.leaf === null ||
      this.position < 0 ||
      this.position >= this.leaf.numberOfKey
    ) {
      throw Error('invalid iterator.');
    }
    this.leaf.items[this.position] = item;
  }

  getLeaf(): Leaf<T, U> {
    return this.leaf;
  }

  getPosition(): number {
    return this.position;
  }

  isValid(): boolean {
    if (
      this.leaf === null ||
      this.position < 0 ||
      this.position >= this.leaf.numberOfKey
    ) {
      return false;
    }
    return true;
  }

  toIndex(): number {
    if (this.leaf === null) return -1;
    let index = 0;
    let p: Inner<T, U> | Leaf<T, U>;
    p = this.leaf;
    index += this.position;
    while (p.parent !== null) {
      for (let j = 0; j < p.position; j++) {
        index += p.parent.getChild(j).partSize;
      }
      p = p.parent;
    }
    return index;
  }

  clear(): void {
    this.leaf = null;
  }
}

export default Iterator;
