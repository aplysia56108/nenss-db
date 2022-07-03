class InvalidIteratorError extends Error {
  constructor() {
    const message = 'invalid iterator.';
    super(message);
  }
}

export default InvalidIteratorError;
