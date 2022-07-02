import Leaf from 'src/leaf';

interface IIterator<T, U> {
  /**
   * Increment its index.
   */
  prev(): boolean;
  /**
   * Decrement its index.
   */
  next(): boolean;
  /**
   * Return the corresponding key. if out of range, throws error.
   */
  getKey(): T;
  /**
   * Return the corresponding item. if out of range, throws error.
   */
  getItem(): U;
  /**
   *  Return the corresponding index.
   */
  set(item: U): void;
  /**
   *  Return the leaf which the data is contained.
   */
  getLeaf(): Leaf<T, U>;
  /**
   *  Return the position in leaf.
   */
  getPosition(): number;
  /**
   *  Return whether it is a valied iterator.
   */
  isValid(): boolean;
  /**
   *  Return the corresponding index.
   */
  toIndex(): number;
  /**
   *  Clear out.
   */
  clear(): void;
}

export default IIterator;
