class UnexpectedTypeOfKeyToInsertError extends Error {
  constructor() {
    const message = 'unexpected type of key to insert.';
    super(message);
  }
}

export default UnexpectedTypeOfKeyToInsertError;
