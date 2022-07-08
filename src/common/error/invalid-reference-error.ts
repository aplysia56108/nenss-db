class InvalidReferenceError extends Error {
  constructor() {
    const message = 'invalid reference.';
    super(message);
  }
}

export default InvalidReferenceError;
