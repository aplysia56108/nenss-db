import BPlusTree from '../../b-plus-tree';
import InnerObject from '../../inner-object';
import { UnexpectedTypeOfKeyToInsertError } from '../error';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Data = number | string | boolean | { [key: string]: Data | null };

class DataConverter {
  public static toInnerData<T = any>(object: T): Data | null {
    const obj = object as unknown;
    if (obj === null) {
      return null;
    }
    if (
      typeof obj === 'function' ||
      typeof obj === 'undefined' ||
      typeof obj === 'symbol' ||
      typeof obj === 'bigint'
    ) {
      throw new UnexpectedTypeOfKeyToInsertError();
    } else if (typeof obj === 'string') {
      return obj as string;
    } else if (typeof obj === 'number') {
      return obj as number;
    } else if (typeof obj === 'boolean') {
      return obj as boolean;
    }
    const innerData: Data = {};
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        innerData[i.toString()] = this.toInnerData(obj[i]);
      }
    } else {
      const reInterpretationOfObj = obj as unknown as T;
      const keys = Object.keys(reInterpretationOfObj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as keyof T;
        innerData[key.toString()] = this.toInnerData(
          reInterpretationOfObj[key],
        );
      }
    }
    return innerData;
  }

  public static toData<T = any>(object: InnerObject): T {
    const obj = object.getObject();
    if (obj instanceof BPlusTree) {
      if (obj.size() === 0) {
        return null as unknown as T;
      }
      const data: Data = {};
      const iterator = obj.begin();
      for (let i = 0; i < obj.size(); i++) {
        data[iterator.getKey()] = DataConverter.toData(iterator.getItem());
        iterator.next();
      }
      return data as unknown as T;
    }
    return obj as unknown as T;
  }
}

export default DataConverter;
