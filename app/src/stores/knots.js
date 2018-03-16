import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

class Knots {
  constructor() {
    extendObservable(this, {
      knots: [],
      loading: false,
      syncLogs: '',
      synced: false
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
    axios.get('/sync/').then(() => {
      runInAction(() => {
        this.loading = false;
        this.synced = true;
      });
    });
  }
}

const KnotStore = new Knots();
const socket = socketIOClient();
socket.on('live-sync-logs', (data) => KnotStore.appendSyncLogs(data));
export default KnotStore;
