class NullChildReferredError extends Error {
  constructor() {
    const message = 'null child referred.';
    super(message);
  }
}

export default NullChildReferredError;
