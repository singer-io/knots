import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';

class Knots {
  constructor() {
    extendObservable(this, {
      knots: []
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
}

export default new Knots();
