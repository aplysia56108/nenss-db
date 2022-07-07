import { InnerObjectData } from '../common/types';

class DataWrapper {
  private innerObjectData;
  setData(data: InnerObjectData) {
    this.innerObjectData = data;
  }
  getData() {
    return this.innerObjectData;
  }
}

export default DataWrapper;
