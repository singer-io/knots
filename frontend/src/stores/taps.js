import { extendObservable, runInAction, toJS } from 'mobx';
import axios from 'axios';

class Taps {
  constructor() {
    extendObservable(this, {
      taps: [],
      tapFields: [],
      fieldValues: { schema: '' },
      loading: false,
      tapSchema: []
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
    axios
      .post('/tap/tap-redshift/schema/', toJS(this.fieldValues))
      .then((res) => {
        runInAction(() => {
          this.loading = false;
          this.tapSchema = res.data.streams;
        });
      });
  }

  editField(field, index, value) {
    switch (field) {
      case 'selected':
        runInAction(() => {
          this.loading = true;
          this.tapSchema[index].metadata[0].metadata.selected = value;
        });
        runInAction(() => {
          this.loading = false;
        });
        break;
      default:
    }
  }
}

export default new Taps();
