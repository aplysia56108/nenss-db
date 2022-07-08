import { InvalidReferenceError } from '../error';

class RefChecker {
  static isValidString(key: string): boolean {
    if (key === '' || key.length > 1000) {
      return false;
    }
    const re = RegExp(/[^0-9a-zA-Z\-_]/);
    return !re.test(key);
  }

  private static isValidRefArray(refArray: string[]): boolean {
    if (refArray[0] === '') {
      for (let i = 1; i < refArray.length; i++) {
        if (RefChecker.isValidString(refArray[i])) {
          continue;
        }
        return false;
      }
      return true;
    }
    return false;
  }

  public static toRefArray(ref: string): string[] {
    if (ref[0] !== '/') {
      throw new InvalidReferenceError();
    }
    if (ref === '/') {
      return [''];
    }
    const refArray = ref.split('/');
    if (!RefChecker.isValidRefArray(refArray)) {
      throw new InvalidReferenceError();
    }
    return refArray;
  }

  public static isIncluded(includingRef: string, includedRef: string): boolean {
    if (includingRef.length < includedRef.length) {
      return false;
    }
    for (let i = 0; i < includedRef.length; i++) {
      if (includedRef[i] !== includingRef[i]) {
        return false;
      }
    }
    if (
      includingRef.length === includedRef.length ||
      includingRef[includedRef.length] === '/' ||
      includedRef === '/'
    ) {
      return true;
    }
    return false;
  }
}

export default RefChecker;
