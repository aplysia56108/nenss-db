import { conversionMap, alphabet } from './map';

class UniqueKey {
  private static RANDOM_PART_LENGTH = 15;

  private static conversionMap = conversionMap;

  private static alphabet = alphabet;

  private static getTimeStamp = () => {
    const date = new Date();
    return date.getTime();
  };

  private static getRandomNumber(maxVal: number): number {
    return Math.floor(Math.random() * maxVal);
  }

  private static generateRandomString(length: number): string {
    const resultArray = [];
    const alphabetLength = this.alphabet.length;
    for (let i = 0; i < length; i++) {
      const randomLetter = this.alphabet.charAt(
        this.getRandomNumber(alphabetLength)
      );
      resultArray.push(randomLetter);
    }
    const randomString = resultArray.join('');
    return randomString;
  }

  private static convertNumberToString(number: number): string {
    const zeroToP = number.toString(26);
    const zeroToPArray = [...zeroToP];
    const aToZArray = zeroToPArray.map((char) => this.conversionMap.get(char));
    return aToZArray.join('');
  }

  public static generate(): string {
    const timeStampPart = this.convertNumberToString(this.getTimeStamp());
    const randomPart = this.generateRandomString(this.RANDOM_PART_LENGTH);
    const uniqueKey = `${timeStampPart}${randomPart}`;
    return uniqueKey;
  }
}

export default UniqueKey;
