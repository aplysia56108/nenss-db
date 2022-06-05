import Message from './message.js';

class Greeting {
  public static sayHello(name: string) {
    const message = Message.getHello(name);
    process.stdout.write(message);
    process.stdout.write('\n');
  }
}

export default Greeting;
