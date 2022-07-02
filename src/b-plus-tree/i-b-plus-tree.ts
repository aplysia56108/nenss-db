import Iterator from 'src/iterator';

interface IBPlusTree<T, U> {
  /**
   * Return the Iterator object which points to the smallest key which is equal to or greater than the given key.
   * @param key compared key
   */
  lowerBound(key: T): Iterator<T, U>;
  /**
   * Return the Iterator object which points to the smallest key which is greater than the given key.
   * @param key compared key
   */
  upperBound(key: T): Iterator<T, U>;
  /**
   * Return if the given key is already contained as a key in this tree.
   * @param key compared key
   */
  count(key: T): boolean;
  /**
   * Return the iterator corresponding to the given key. if the key is not contained in the tree, return null.
   * @param key compared key
   */
  search(key: T): Iterator<T, U> | null;
  /**
   * Return the Iterator object which points to n-th smallest key (zero indexed).
   * @param i index of key when all the contained key was sorted.
   */
  get(i: number): Iterator<T, U>;
  /**
   * Return the Iterator object which points to the smallest key. same as get(0).
   */
  begin(): Iterator<T, U>;
  /**
   * Return the Iterator object next to the one which points to the greatest key. same as get(.size()). note that it is invalid iterator.
   */
  end(): Iterator<T, U>;
  /**
   * If the key is already contained in the tree, overwrite the corresponding item to the given item and return false and its iterator. else insert the pair of the argument key and item and return true and iterator.
   * @param key referenced key
   * @param item inserted item
   */
  insert(key: T, item: U): [boolean, Iterator<T, U>];
  /**
   * If the key is already contained in the tree, return false and its iterator. else insert the pair of the argument key and item and return trueand return true and iterator.
   * @param key referenced key
   * @param item inserted item
   */
  push(key: T, item: U): [boolean, Iterator<T, U>];
  /**
   * If the key is already contained in the tree, return true and erase key and item in the tree. else return false.
   * @param key compared key
   */
  erase(key: T): boolean;
  /**
   * Erase key and item which given iterater corresponding to in the tree.
   * @param iterator iterator corresponding to the erasing key and item
   */
  delete(iterator: Iterator<T, U>): void;
  /**
   * Return the size of the tree.
   */
  size(): number;
  /**
   * Clear out the tree.
   */
  clear(): void;
}

export default IBPlusTree;
