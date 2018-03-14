import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';

class Knots {
  constructor() {
    extendObservable(this, {
      knots: [],
      loading: false
    });
  }

  getKnots() {
    runInAction(() => {
      this.loading = true;
    });
    axios.get('/knots/').then((response) => {
      runInAction(() => {
        this.knots = response.data;
        this.loading = false;
      });
    });
  }

  sync() {
    runInAction(() => {
      this.loading = true;
    });
    axios.get('/sync/').then(() => {
      runInAction(() => {
        this.loading = false;
      });
    });
  }
}

export default new Knots();
