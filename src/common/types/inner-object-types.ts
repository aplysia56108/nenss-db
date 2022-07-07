import { Snapshot } from '../../snapshot';
import BPlusTree from '../../b-plus-tree';
import InnerObject from '../../inner-object';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Data = number | string | boolean | { [key: string]: Data | null };
type Func<T = any> = (data: Snapshot<T>) => void;
type InnerObjectData =
  | BPlusTree<string, InnerObject>
  | number
  | string
  | boolean;
type Subscriptions = {
  [ref: string]: { [id: string]: Func };
};
class NullData extends BPlusTree<string, InnerObject> {}

export { Data, Func, InnerObjectData, Subscriptions, NullData };
