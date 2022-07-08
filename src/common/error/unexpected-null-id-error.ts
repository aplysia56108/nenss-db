class UnexpectedNullIdError extends Error {
  constructor() {
    const message = 'unexpected null id.';
    super(message);
  }
}

export default UnexpectedNullIdError;
