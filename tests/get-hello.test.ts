import Message from '../src/message.js';

test('getHelloWithCorrectName', () => {
  const name = 'Test';
  const message = Message.getHello(name);
  expect(message).toBe(`Hello ${name}!`);
});

test('getHelloWithInvalidName', () => {
  const name = '';
  const getMessage = () => Message.getHello(name);
  expect(getMessage).toThrowError('Name is required');
});
