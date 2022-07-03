class UnexpectedNullItemError extends Error {
  constructor() {
    const message = 'unexpected null item.';
    super(message);
  }
}

export default UnexpectedNullItemError;
