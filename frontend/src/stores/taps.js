import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';

class Taps {
  constructor() {
    extendObservable(this, {
      taps: []
    });
  }

  getTaps() {
    axios.get('/taps/').then((response) => {
      runInAction(() => {
        this.taps = response.data;
      });
    });
  }
}

export default new Taps();
