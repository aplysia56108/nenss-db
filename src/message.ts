class Message {
  public static getHello(name: string): string {
    if (name === '') {
      throw new Error('Name is required');
    }
    return `Hello ${name}!`;
  }
}

export default Message;
