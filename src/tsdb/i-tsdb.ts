/* eslint-disable @typescript-eslint/no-explicit-any */
interface ITsdb {
  /**
   * Get a snapshot of the data from the database.
   * @param ref the reference to the data
   */
  get<T = any>(ref: string): Promise<T>;

  /**
   * Save data to a specified reference, replacing any existing data at that path.
   * @param ref the reference to the data
   * @param data the data to save
   */
  set<T = any>(ref: string, data: T): Promise<void>;

  /**
   * Write to specific children of a node without overwriting other child nodes.
   * @param ref the reference to the data
   * @param data the data to save
   */
  update<T = any>(ref: string, data: T): Promise<void>;

  /**
   * Creating a new node at that path if it does not already exist and returns a reference key to the new node.
   * @param ref the reference to the data
   * @param data the data to save
   * @param key the key to save the data under (if not specified, it will automatically be generated)
   */
  push<T = any>(ref: string, data: T, key?: string): Promise<string>;

  /**
   * Remove data from the database.
   * @param ref the reference to the data
   */
  delete(ref: string): Promise<void>;

  /**
   * Add a completion callback and return a id to unsubscribe.
   * @param ref the reference to the data
   * @param callback the callback to call when the data has been committed
   */
  subscribe<T = any>(ref: string, callback: (data: T) => void): string;

  /**
   * Remove a subscription.
   * @param id the id of the subscription to unsubscribe (if not specified, all subscriptions will be removed)
   */
  unsubscribe(id?: string): void;
}

export default ITsdb;
