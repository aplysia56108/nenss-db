class UnexpectedWrongIdToExecuteWriteError extends Error {
  constructor() {
    const message = 'unexpected wrong id to execute write.';
    super(message);
  }
}

export default UnexpectedWrongIdToExecuteWriteError;
