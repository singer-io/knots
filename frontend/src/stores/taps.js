import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';

class Taps {
  constructor() {
    extendObservable(this, {
      taps: [],
      tapFields: []
    });
  }

  getTaps() {
    axios.get('/taps/').then((response) => {
      runInAction(() => {
        this.taps = response.data;
      });
    });
  }

  getTapFields(tap) {
    axios
      .post('/taps/', {
        key: tap
      })
      .then((response) => {
        runInAction(() => {
          this.tapFields = response.data.config;
        });
      });
  }
}

export default new Taps();
