import inner from '../inner/index';
import Leaf from '../leaf/index';

class Debugger<T, U> {
  private node;
  constructor(node: inner<T, U> | Leaf<T, U>) {
    this.node = node;
  }

  // for debug
  show(): string {
    if (this.node instanceof Leaf) {
      let out = '< ';
      if (this.node.prev === null) out += '(begin)';
      else {
        out +=
          '(' +
          String(this.node.prev.keys[this.node.prev.numberOfKey - 1]) +
          ') ';
      }
      for (let i = 0; i < this.node.numberOfKey; i++) {
        out += String(this.node.keys[i]) + ' ';
      }
      if (this.node.next === null) out += '(end)';
      else {
        out += '(' + String(this.node.next.keys[0]) + ') ';
      }
      out += '( ';
      if (this.node.parent === null) out += 'root : ';
      else {
        out += String(this.node.parent.keys[0]) + ' : ';
      }
      out +=
        String(this.node.position) + ' : ' + String(this.node.partSize) + ' )>';
      return out;
    }
    let out = '{ ';
    for (let i = 0; i < this.node.numberOfKey; i++) {
      out += String(this.node.keys[i]) + ' ';
    }
    out += '( ';
    if (this.node.parent === null) out += 'root : ';
    else {
      out += String(this.node.parent.keys[0]) + ' : ';
    }
    out +=
      String(this.node.position) + ' : ' + String(this.node.partSize) + ' )}';
    return out;
  }
}

export default Debugger;
