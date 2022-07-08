class InvalidKeyStringError extends Error {
  constructor() {
    const message = 'invalid key string.';
    super(message);
  }
}

export default InvalidKeyStringError;
