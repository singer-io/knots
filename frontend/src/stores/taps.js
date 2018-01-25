import { extendObservable, runInAction, toJS } from 'mobx';
import axios from 'axios';

class Taps {
  constructor() {
    extendObservable(this, {
      taps: [],
      tapFields: [],
      fieldValues: { schema: '' },
      loading: false
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

  setTapFields(field, value) {
    runInAction(() => {
      this.fieldValues[field] = value;
    });
  }

  submitFields() {
    runInAction(() => {
      this.loading = true;
    });
    axios.post('/tap/tap-redshift/schema/', toJS(this.fieldValues)).then(() => {
      runInAction(() => {
        this.loading = false;
      });
    });
  }
}

export default new Taps();
