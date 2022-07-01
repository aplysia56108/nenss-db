import Inner from '../inner/index';
import Leaf from '../leaf/index';
import Iterator from '../iterator/index';
import Debugger from '../debugger/index';
import IBPlusTree from './i-b-plus-tree';

class BPlusTree<T, U> implements IBPlusTree<T, U> {
  private root: Inner<T, U> | Leaf<T, U>;
  private order: number;
  static defaultOrder = 31;
  constructor(order = BPlusTree.defaultOrder) {
    this.order = order;
    this.root = new Leaf(this.order);
  }
  private resetRoot(): void {
    if (this.root.parent !== null) {
      this.root = this.root.parent;
      this.resetRoot();
    }
    if (this.root.numberOfKey === 0) {
      if (this.root instanceof Leaf) return;
      this.root = this.root.getChild(0);
      this.root.parent = null;
      this.resetRoot();
    }
  }

  private locate(
    p: Inner<T, U> | Leaf<T, U>,
    key: T,
  ): [boolean, Leaf<T, U>, number] {
    const i = p.lowerBound(key);
    if (p instanceof Leaf) {
      if (i < p.numberOfKey && p.keys[i] === key) {
        return [true, p, i];
      }
      return [false, p, i];
    }
    return this.locate(p.getChild(i), key);
  }

  private locateByIndex(
    p: Inner<T, U> | Leaf<T, U>,
    index: number,
  ): Iterator<T, U> {
    if (p instanceof Leaf) {
      return new Iterator<T, U>(p, index);
    }
    let position = p.numberOfKey;
    for (let j = 0; j < p.numberOfKey; j++) {
      if (index - p.getChild(j).partSize >= 0) {
        index -= p.getChild(j).partSize;
      } else {
        position = j;
        break;
      }
    }
    return this.locateByIndex(p.getChild(position), index);
  }

  public lowerBound(key: T): Iterator<T, U> {
    const location = this.locate(this.root, key);
    return new Iterator<T, U>(location[1], location[2]);
  }

  public upperBound(key: T): Iterator<T, U> {
    const [isPresent, leaf, i] = this.locate(this.root, key);
    const iterator = new Iterator<T, U>(leaf, i);
    if (isPresent) iterator.next();
    return iterator;
  }

  public count(key: T): boolean {
    return this.locate(this.root, key)[0];
  }

  public search(key: T): Iterator<T, U> | null {
    const [isPresent, leaf, i] = this.locate(this.root, key);
    const iterator = new Iterator<T, U>(leaf, i);
    if (isPresent) return iterator;
    return null;
  }

  public get(i: number): Iterator<T, U> {
    return this.locateByIndex(this.root, i);
  }

  public begin(): Iterator<T, U> {
    return this.get(0);
  }

  public end(): Iterator<T, U> {
    return this.get(this.size());
  }

  public insert(key: T, item: U): [boolean, Iterator<T, U>] {
    const [isPresent, leaf, i] = this.locate(this.root, key);
    if (isPresent) {
      leaf.items[i] = item;
      return [false, new Iterator<T, U>(leaf, i)];
    }
    leaf.insert(i, key, item);
    this.resetRoot();
    return [true, new Iterator<T, U>(leaf, i)];
  }

  public push(key: T, item: U): [boolean, Iterator<T, U>] {
    const [isPresent, leaf, i] = this.locate(this.root, key);
    if (isPresent) {
      return [false, new Iterator<T, U>(leaf, i)];
    }
    leaf.insert(i, key, item);
    this.resetRoot();
    return [true, new Iterator<T, U>(leaf, i)];
  }

  public erase(key: T): boolean {
    const [isPresent, leaf, i] = this.locate(this.root, key);
    if (isPresent) {
      leaf.erase(i);
      this.resetRoot();
      return true;
    }
    return false;
  }

  public delete(iterator: Iterator<T, U>): void {
    const leaf = iterator.getLeaf();
    if (leaf !== null) {
      leaf.erase(iterator.getPosition());
      this.resetRoot();
    }
  }

  public size(): number {
    return this.root.partSize;
  }

  public clear(): void {
    this.root = new Leaf(this.order);
  }

  // for debag
  private static print(
    p: (Inner<unknown, unknown> | Leaf<unknown, unknown>)[],
  ): void {
    const out: (Inner<unknown, unknown> | Leaf<unknown, unknown>)[] = new Array(
      0,
    );
    let output = '';
    for (let i = 0; i < p.length; i++) {
      output += new Debugger(p[i]).show();
      for (let j = 0; j <= p[i].numberOfKey; j++) {
        const m = p[i];
        if (m instanceof Inner) out.push(m.getChild(j));
      }
    }
    console.log(output);
    if (out.length > 0) {
      this.print(out);
    }
  }

  // for debag
  public show(): void {
    BPlusTree.print([this.root]);
  }
}

export default BPlusTree;
