import DataConverter from '../common/data-converter';
import InnerObject from '../inner-object';
import ISnapshot from './i-snapshot';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Data = number | string | boolean | { [key: string]: Data | null };

class Snapshot<T = any> implements ISnapshot<T> {
  private object: Data | null;
  private isData: boolean;
  constructor(innerObject: InnerObject | null) {
    if (innerObject === null) {
      this.object = null;
      this.isData = false;
    } else {
      this.object = DataConverter.toData(innerObject);
      if (this.object === null) {
        this.isData = false;
      } else {
        this.isData = true;
      }
    }
  }

  public val(): T {
    return this.object as unknown as T;
  }

  public exists(): boolean {
    return this.isData;
  }
}

export default Snapshot;
