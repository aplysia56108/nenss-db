import { Snapshot } from '../../snapshot';
import BPlusTree from '../../b-plus-tree';
import InnerObject from '../../inner-object';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Data = number | string | boolean | { [key: string]: Data | null };
type Func<T = any> = (data: Snapshot<T>) => void;
type InnerObjectTree = BPlusTree<string, InnerObject>;
type InnerObjectData = InnerObjectTree | number | string | boolean;
type Subscriptions = {
  [ref: string]: Func[];
};

export { Data, Func, InnerObjectTree, InnerObjectData, Subscriptions };
