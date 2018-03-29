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
      selectedKnot: '',
      persist: {},
      syncMode: '',
      reconfiguredKnot: ''
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
    const selected = localStorage.getItem('SelectedKnot') || '';
    axios
      .post('/sync/', {
        knot: this.selectedKnot || selected,
        mode: this.syncMode
      })
      .then(() => {
        runInAction(() => {
          this.loading = false;
          this.synced = true;
          localStorage.removeItem('SelectedKnot');
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

  setKnot(knot, mode) {
    runInAction(() => {
      this.selectedKnot = knot;
      this.syncMode = mode;
    });
  }

  download(knot) {
    axios.post('/download/', { knot }).then(() => {
      axios({
        url: 'http://localhost:5000/download',
        method: 'GET',
        responseType: 'blob' // important
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${knot}.zip`);
        document.body.appendChild(link);
        link.click();
      });
    });

    runInAction(() => {
      this.selectedKnot = knot;
    });
  }

  configureKnot(knot) {
    runInAction(() => {
      this.reconfiguredKnot = knot;
      localStorage.setItem('SelectedKnot', JSON.stringify(knot));
    });
    axios
      .get('/rehydrate/', {
        params: {
          knot
        }
      })
      .then((res) => {
        runInAction(() => {
          this.persist = res.data;
        });
      });
  }
}

const KnotStore = new Knots();
const socket = socketIOClient();
socket.on('live-sync-logs', (data) => KnotStore.appendSyncLogs(data));
export default KnotStore;
