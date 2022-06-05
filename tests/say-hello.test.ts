import { jest } from '@jest/globals';
import Greeting from '../src/greeting.js';
import Message from '../src/message.js';

test('sayHelloTest', () => {
  const mockGetHello = jest.fn((name: string) => `Hi ${name}!`);
  Message.getHello = mockGetHello;
  Greeting.sayHello('Test');
  expect(mockGetHello.mock.calls[0][0]).toEqual('Test');
  expect(mockGetHello.mock.calls.length).toEqual(1);
  expect(mockGetHello.mock.results[0]).toEqual({
    type: 'return',
    value: 'Hi Test!',
  });
});
