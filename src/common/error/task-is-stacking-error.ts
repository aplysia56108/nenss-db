class TaskIsStackingError extends Error {
  constructor() {
    const message = 'task is stacking.';
    super(message);
  }
}

export default TaskIsStackingError;
