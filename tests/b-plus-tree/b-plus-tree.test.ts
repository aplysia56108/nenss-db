import Leaf from '../../src/leaf';
import BPlusTree from '../../src/b-plus-tree';
import {
  InvalidIteratorError,
  NullChildReferredError,
  UnexpectedNullItemError,
} from '../../src/common/error';
import Inner from '../../src/inner';
import Iterator from '../../src/iterator';

test('insert-test', () => {
  const target = new BPlusTree<number, number>(5);
  const sample = [
    192, 16, 8, 187, 108, 72, 69, 179, 174, 94, 99, 143, 21, 88, 87, 77, 15,
    155, 56, 144, 53, 42, 176, 129, 196, 49, 78, 169, 13, 74, 198, 86, 100, 34,
    59, 19, 25, 136, 128, 112, 91, 28, 113, 127, 83, 109, 133, 105, 50, 154,
    119, 125, 44, 89, 43, 131, 73, 71, 170, 104, 23, 1, 193, 24, 65, 164, 70,
    63, 22, 0, 181, 45, 38, 171, 93, 20, 190, 37, 194, 55, 52, 146, 9, 150, 95,
    48, 2, 111, 118, 4, 32, 46, 10, 110, 85, 36, 97, 11, 90, 123, 35, 159, 121,
    147, 120, 189, 80, 188, 141, 186, 135, 76, 142, 17, 199, 7, 84, 122, 132,
    29, 184, 82, 107, 197, 117, 57, 66, 116, 182, 26, 98, 54, 140, 124, 106,
    165, 92, 47, 103, 195, 96, 137, 185, 114, 162, 64, 62, 153, 156, 39, 68, 81,
    61, 151, 157, 58, 115, 177, 161, 3, 183, 60, 30, 168, 149, 126, 79, 102,
    101, 130, 51, 67, 152, 14, 12, 6, 40, 172, 75, 41, 148, 145, 138, 163, 167,
    175, 33, 191, 139, 134, 31, 18, 27, 160, 178, 173, 166, 180, 5, 158,
  ];
  for (let i = 0; i < sample.length; i++) {
    target.insert(sample[i], sample[i] ** 2);
  }
  const output: [number, number][] = [];
  const iterator = target.begin();
  for (let i = 0; i < target.size(); i++) {
    output.push([iterator.getKey(), iterator.getItem()]);
    iterator.next();
  }
  const expectedOutput: [number, number][] = [];
  for (let i = 0; i < sample.length; i++) {
    expectedOutput.push([i, i ** 2]);
  }
  expect(output.toString()).toBe(expectedOutput.toString());
});

test('erase-test', () => {
  const target = new BPlusTree<number, number>(5);
  const insertSample = [
    38, 252, 70, 253, 273, 154, 182, 190, 181, 185, 27, 42, 13, 132, 18, 121,
    111, 242, 276, 45, 150, 102, 24, 106, 161, 130, 285, 264, 127, 55, 138, 147,
    245, 69, 296, 31, 8, 215, 16, 203, 174, 21, 91, 79, 229, 136, 187, 234, 34,
    117, 30, 56, 217, 119, 78, 124, 243, 208, 66, 196, 228, 87, 129, 41, 166,
    247, 233, 256, 47, 258, 295, 263, 157, 257, 61, 120, 57, 202, 5, 149, 163,
    4, 52, 73, 177, 267, 164, 98, 218, 116, 282, 140, 64, 54, 162, 94, 125, 230,
    126, 269, 22, 71, 200, 250, 188, 297, 186, 43, 15, 209, 93, 89, 292, 214,
    235, 265, 279, 28, 101, 144, 139, 23, 141, 110, 1, 137, 63, 207, 268, 48,
    95, 84, 17, 145, 246, 122, 44, 222, 171, 92, 178, 19, 239, 251, 205, 151,
    223, 115, 298, 100, 143, 224, 281, 220, 25, 35, 287, 60, 123, 107, 192, 191,
    275, 201, 210, 170, 194, 172, 283, 135, 152, 77, 221, 37, 33, 10, 53, 165,
    261, 76, 12, 262, 212, 104, 198, 254, 175, 20, 80, 167, 112, 59, 199, 236,
    109, 148, 270, 99, 180, 50, 237, 39, 179, 9, 193, 288, 146, 189, 114, 134,
    238, 62, 271, 29, 153, 90, 219, 173, 40, 274, 83, 168, 68, 260, 277, 113,
    133, 81, 155, 142, 128, 291, 293, 299, 14, 248, 118, 206, 26, 211, 160, 156,
    272, 226, 75, 74, 96, 65, 131, 3, 32, 51, 249, 11, 184, 49, 88, 294, 2, 278,
    67, 280, 204, 259, 169, 105, 244, 213, 240, 103, 232, 183, 284, 108, 255,
    225, 195, 227, 46, 97, 58, 0, 82, 72, 197, 6, 286, 231, 158, 241, 85, 289,
    159, 86, 36, 290, 176, 216, 7, 266,
  ];
  const eraseSample = [
    202, 105, 110, 150, 122, 206, 154, 210, 293, 295, 169, 215, 273, 180, 223,
    240, 147, 183, 198, 286, 208, 220, 134, 296, 188, 245, 190, 171, 115, 200,
    191, 283, 242, 142, 161, 269, 225, 231, 100, 217, 103, 125, 233, 262, 141,
    258, 163, 239, 127, 257, 277, 218, 252, 146, 297, 157, 259, 179, 184, 149,
    155, 203, 207, 292, 101, 266, 162, 132, 221, 216, 254, 130, 235, 229, 176,
    158, 288, 135, 109, 253, 211, 138, 282, 270, 199, 116, 224, 228, 123, 181,
    255, 129, 274, 140, 260, 148, 209, 137, 164, 133, 120, 236, 285, 279, 264,
    195, 111, 290, 248, 143, 193, 246, 205, 194, 136, 118, 237, 124, 170, 189,
    294, 284, 177, 117, 213, 244, 168, 187, 106, 144, 102, 249, 276, 222, 172,
    121, 232, 230, 263, 175, 201, 247, 275, 160, 299, 250, 112, 108, 243, 153,
    234, 227, 267, 251, 197, 238, 298, 167, 178, 119, 287, 261, 214, 212, 114,
    152, 196, 159, 256, 139, 291, 280, 272, 185, 107, 281, 104, 166, 126, 174,
    289, 241, 226, 156, 173, 182, 113, 186, 192, 204, 165, 265, 131, 145, 271,
    219, 268, 151, 278, 128,
  ];
  for (let i = 0; i < insertSample.length; i++) {
    target.insert(insertSample[i], insertSample[i] ** 2);
  }
  for (let i = 0; i < eraseSample.length; i++) {
    target.erase(eraseSample[i]);
  }
  const output: [number, number][] = [];
  const iterator = target.begin();
  for (let i = 0; i < target.size(); i++) {
    output.push([iterator.getKey(), iterator.getItem()]);
    iterator.next();
  }
  const expectedOutput: [number, number][] = [];
  for (let i = 0; i < insertSample.length - eraseSample.length; i++) {
    expectedOutput.push([i, i ** 2]);
  }
  expect(output.toString()).toBe(expectedOutput.toString());
  for (let i = 0; i < insertSample.length - eraseSample.length; i++) {
    target.erase(i);
  }
  expect(target.size()).toBe(0);
});

test('small test', () => {
  const target = new BPlusTree<number, number>(5);
  const insertSample = [0, 1, 2];
  const eraseSample = [2, 0, 1];

  for (let i = 0; i < insertSample.length; i++) {
    target.insert(insertSample[i], insertSample[i] ** 2);
  }

  for (let i = 0; i < insertSample.length; i++) {
    target.erase(eraseSample[i]);
  }
  expect(target.size()).toBe(0);
});

test('null item error test', () => {
  const leaf = new Leaf(5);
  leaf.items[1] = null;
  expect(() => leaf.getItem(1)).toThrow(UnexpectedNullItemError);
});

test('null child error test', () => {
  const inner = new Inner(5);
  inner.children[1] = null;
  expect(() => inner.getChild(1)).toThrow(NullChildReferredError);
});

test('clear test', () => {
  const target = new BPlusTree<number, number>(5);
  for (let i = 0; i < 100; i++) {
    target.insert(i, i);
  }
  expect(target.size()).toBe(100);
  target.clear();
  expect(target.size()).toBe(0);
});

test('iterator test', () => {
  const target = new BPlusTree<number, number>(5);
  for (let i = 0; i < 50; i++) {
    target.insert(i, i);
  }
  const iterator = target.end();
  expect(() => iterator.getKey()).toThrow(InvalidIteratorError);
  expect(() => iterator.getItem()).toThrow(InvalidIteratorError);
  const iterator2 = new Iterator<number, number>(iterator.getLeaf(), -10);
  expect(iterator2.toIndex()).toBe(50 - iterator.getPosition() - 10);
  expect(iterator.isValid()).toBe(false);
  for (let i = 0; i < 10; i++) {
    iterator.prev();
  }
  expect(iterator.isValid()).toBe(true);
  expect(iterator.toIndex()).toBe(40);
  iterator.clear();
  expect(iterator.isValid()).toBe(false);
  expect(iterator.prev()).toBe(false);
  expect(iterator.next()).toBe(false);
  expect(() => iterator.set(1)).toThrow(InvalidIteratorError);
  expect(iterator.toIndex()).toBe(-1);
});

test('push insert lowerBound upperBound', () => {
  const target = new BPlusTree<number, number>(5);
  target.insert(1, 1);
  target.insert(3, 3);
  expect(target.insert(5, 5)[0]).toBe(true);
  const iterator1 = target.insert(1, 3);
  expect(iterator1[0]).toBe(false);
  expect(iterator1[1].getItem()).toBe(3);
  const iterator2 = target.push(1, 5);
  expect(iterator2[0]).toBe(false);
  expect(iterator2[1].getItem()).toBe(3);
  const iterator3 = target.push(2, 2);
  expect(iterator3[0]).toBe(true);
  expect(iterator3[1].getItem()).toBe(2);
  const iterator4 = target.lowerBound(3);
  expect(iterator4.getKey()).toBe(3);
  expect(iterator4.getItem()).toBe(3);
  const iterator5 = target.lowerBound(4);
  expect(iterator5.getKey()).toBe(5);
  expect(iterator5.getItem()).toBe(5);
  const iterator6 = target.upperBound(3);
  expect(iterator6.getKey()).toBe(5);
  expect(iterator6.getItem()).toBe(5);
  const iterator7 = target.upperBound(4);
  expect(iterator7.getKey()).toBe(5);
  expect(iterator7.getItem()).toBe(5);
  iterator7.set(10);
  const iterator8 = target.search(5);
  expect(iterator8.getItem()).toBe(10);
  expect(target.count(5)).toBe(true);
  target.delete(iterator8);
  expect(target.search(5)).toBe(null);
  expect(target.count(5)).toBe(false);
});
