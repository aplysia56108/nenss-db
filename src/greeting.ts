import Message from './message';

class Greeting {
  public static sayHello(name: string) {
    const message = Message.getHello(name);
    process.stdout.write(message);
    process.stdout.write('\n');
  }
}

export default Greeting;
