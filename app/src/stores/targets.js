import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';

class Targets {
  constructor() {
    extendObservable(this, {
      activeTargets: [],
      inactiveTargets: [],
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

  getTargetCredentials(target, version) {
    runInAction(() => {
      this.loading = true;
    });
    axios
      .post('/targets/', {
        target,
        version
      })
      .then((response) => {
        console.log(response);
        return runInAction(() => {
          this.loading = false;
        });
      });
  }
}

export default new Targets();
