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
    runInAction(() => {
      this.loading = true;
    });
    axios.get('/taps/').then((response) => {
      runInAction(() => {
        this.taps = response.data;
        this.loading = false;
      });
    });
  }

  getTapFields(tap) {
    runInAction(() => {
      this.loading = true;
    });
    axios
      .post('/taps/', {
        key: tap
      })
      .then((response) => {
        runInAction(() => {
          this.tapFields = response.data.config;
          this.loading = false;
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
      case 'replication_key':
        runInAction(() => {
          this.loading = true;
          this.tapSchema[index].replication_key = value;
        });
        runInAction(() => {
          this.loading = false;
        });
        break;
      default:
    }
  }

  submitSchema() {
    axios
      .post('/tap/tap-redshift/selected/', {
        streams: JSON.stringify({ streams: toJS(this.tapSchema) })
      })
      .then((res) => {
        console.log('This is the response', res);
      });
  }
}

export default new Taps();
