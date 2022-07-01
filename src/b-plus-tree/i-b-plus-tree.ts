import Iterator from '../iterator';

interface IBPlusTree<T, U> {
  // return the Iterator object which points to the smallest key which is equal to or greater than the argument.
  lowerBound(key: T): Iterator<T, U>;
  // return the Iterator object which points to the smallest key which is greater than the argument.
  upperBound(key: T): Iterator<T, U>;
  // return if the argument is already contained as a key in this tree.
  count(key: T): boolean;
  // return the item corresponding to the argument key. if the argument is not contained in the tree, return null.
  search(key: T): Iterator<T, U> | null;
  // return the Iterator object which points to "the argument times" smallest key (zero indexed).
  get(i: number): Iterator<T, U>;
  // return the Iterator object which points to the smallest key. same as get(0).
  begin(): Iterator<T, U>;
  // return the Iterator object next to the one which points to the greatest key. same as get(.size()). note that it is null iterator.
  end(): Iterator<T, U>;
  // if the argument key is already contained in the tree, update the corresponding item to the argument item and return false. else insert the pair of the argument key and item and return true.
  insert(key: T, item: U): [boolean, Iterator<T, U>];
  // if the argument key is not contained in the tree, return false. else erase the pair of key and item corresponding to the argument kry and return true.
  erase(key: T): boolean;
  // return the number of pairs of key and item which are contained in the tree.
  size(): number;
  // initialize the tree.
  clear(): void;
  // for debug. output the structure of all the keys contained.
  show(): void;
}

export default IBPlusTree;
