import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

class Knots {
  constructor() {
    extendObservable(this, {
      knots: [],
      loading: false,
      syncLogs: '',
      synced: false,
      selectedKnot: ''
    });
  }

  appendSyncLogs(data) {
    this.syncLogs = this.syncLogs.concat(`=> ${data} \n`);
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
    axios.post('/sync/', { knot: this.selectedKnot }).then(() => {
      runInAction(() => {
        this.loading = false;
        this.synced = true;
      });
    });
  }

  saveKnot(name) {
    return new Promise((resolve, reject) => {
      runInAction(() => {
        this.loading = true;
      });
      axios
        .post('/save-knot/', { name })
        .then(() => {
          runInAction(() => {
            this.loading = false;
          });
          resolve('good');
        })
        .catch(() => {
          reject();
        });
    });
  }

  setKnot(knot) {
    runInAction(() => {
      this.selectedKnot = knot;
    });
  }
}

const KnotStore = new Knots();
const socket = socketIOClient();
socket.on('live-sync-logs', (data) => KnotStore.appendSyncLogs(data));
export default KnotStore;
