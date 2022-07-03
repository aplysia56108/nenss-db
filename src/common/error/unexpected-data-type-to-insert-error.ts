class UnexpectedDataTypeToInsertError extends Error {
  constructor(type: string) {
    const message = `Unexpected data type to insert. The type of data and its child data should be one of 'null', 'string', 'boolean', 'number' or 'object', but is '${type}'.`;
    super(message);
  }
}

export default UnexpectedDataTypeToInsertError;
