import UniqueKey from '../src/common/unique-key/index.js';

test('generate', () => {
  const name = 'abc';
  const message = UniqueKey.generate();
  expect(message).toBe(name);
});
