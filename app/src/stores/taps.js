import { extendObservable, runInAction, toJS } from 'mobx';
import axios from 'axios';

class Taps {
  constructor() {
    extendObservable(this, {
      activeTaps: [],
      inactiveTaps: [],
      tapFields: [],
      fieldValues: { schema: '' },
      loading: false,
      tapSchema: [],
      dockerInstalled: true
    });
  }

  getTaps() {
    runInAction(() => {
      this.loading = true;
    });
    axios.get('/taps/').then((response) => {
      runInAction(() => {
        this.activeTaps = response.data.activeTaps;
        this.inactiveTaps = response.data.inactiveTaps;
        this.loading = false;
      });
    });
  }

  getTapFields(tap, version) {
    runInAction(() => {
      this.loading = true;
    });
    axios
      .post('/taps/', {
        tap,
        version
      })
      .then((response) => {
        if (!response.data.docker) {
          return runInAction(() => {
            this.dockerInstalled = false;
            this.loading = false;
          });
        }
        return runInAction(() => {
          this.dockerInstalled = true;
          this.tapFields = response.data.config || [];
          this.loading = false;
        });
      });
  }

  setTapFields(field, value, index) {
    runInAction(() => {
      this.fieldValues[field] = value;
      this.tapFields[index].value = value;
    });
  }

  submitConfig() {
    runInAction(() => {
      this.loading = true;
    });
    axios.post('/tap/schema/', toJS(this.tapFields)).then((res) => {
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
