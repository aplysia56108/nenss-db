import { Snapshot } from '../../snapshot';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Data = number | string | boolean | { [key: string]: Data | null };
type Func<T = any> = (data: Snapshot<T>) => void;
type Subscriptions = {
  [ref: string]: Func[];
};

export { Data, Func, Subscriptions };
