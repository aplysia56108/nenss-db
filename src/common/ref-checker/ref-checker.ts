import { InvalidReferenceError, InvalidKeyStringError } from '../error';

class RefChecker {
  static checkRefString(key: string): void {
    if (key === '' || key.length >= 1000) {
      throw new InvalidKeyStringError();
    }
    const re = RegExp(/[^0-9a-zA-Z\-_]/);
    if (re.test(key)) {
      throw new InvalidKeyStringError();
    }
  }

  private static checkRefArray(refArray: string[]) {
    if (refArray[0] === '') {
      for (let i = 1; i < refArray.length; i++) {
        RefChecker.checkRefString(refArray[i]);
      }
      return;
    }
    throw new InvalidReferenceError();
  }

  public static toRefArray(ref: string): string[] {
    if (ref[0] !== '/') {
      throw new InvalidReferenceError();
    }
    if (ref === '/') {
      return [''];
    }
    const refArray = ref.split('/');
    RefChecker.checkRefArray(refArray);
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
