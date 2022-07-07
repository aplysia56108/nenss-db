class Query {
  func: () => Promise<void>;
  status: string;
  id: string;
  ref: string;
  constructor(
    func: () => Promise<void>,
    ref: string,
    status = 'read-or-write',
    id: string | null = null,
  ) {
    this.func = func;
    this.status = status;
    this.id = id;
    this.ref = ref;
  }
}

export default Query;
