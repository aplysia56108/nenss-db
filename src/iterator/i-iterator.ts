interface IIterator<T, U> {
  // decrement its index.
  prev(): boolean;
  // increment its index.
  next(): boolean;
  // return the corresponding pair of key and item. if out og range, return a pair of null.
  get(): [T, U] | [null, null];
  // return the corresponding index.
  toIndex(): number;
  // initialize.
  clear(): void;
}

export default IIterator;
