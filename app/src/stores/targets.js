import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';

class Targets {
  constructor() {
    extendObservable(this, {
      activeTargets: [],
      inactiveTargets: [],
      targetFields: [],
      loading: false
    });
  }

  getTargets() {
    runInAction(() => {
      this.loading = true;
    });
    axios.get('/targets/').then((response) => {
      runInAction(() => {
        this.activeTargets = response.data.activeTargets;
        this.inactiveTargets = response.data.inactiveTargets;
        this.loading = false;
      });
    });
  }
}

export default new Targets();
