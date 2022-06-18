/* eslint-disable @typescript-eslint/no-explicit-any */
interface ISnapshot<T = any> {
  /**
   * Retrieve the data in the snapshot.
   */
  val(): T;
  /**
   * Return a boolean indicating whether or not the data is in the snapshot.
   */
  exists(): boolean;
}

export default ISnapshot;
