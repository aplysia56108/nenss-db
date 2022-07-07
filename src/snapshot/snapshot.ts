import DataConverter from '../common/data-converter';
import ISnapshot from './i-snapshot';
import { Data, InnerObjectData } from '../common/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

class Snapshot<T = any> implements ISnapshot<T> {
  private object: Data | null;
  private isData: boolean;
  constructor(innerObjectData: InnerObjectData) {
    this.object = DataConverter.toData(innerObjectData);
    if (this.object === null) {
      this.isData = false;
    } else {
      this.isData = true;
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
