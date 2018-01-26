import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';

class User {
  constructor() {
    extendObservable(this, {
      datasets: [],
      token: '',
      dataset: ''
    });
  }

  getToken(code) {
    runInAction(() => {
      this.loading = true;
    });
    axios
      .post('/access_token/', {
        code
      })
      .then((response) => {
        runInAction(() => {
          this.token = response.data;
          this.loading = false;
        });
      });
  }

  getDatasets() {
    runInAction(() => {
      this.loading = true;
    });
    axios({
      method: 'GET',
      url: 'https://api.data.world/v0/user/datasets/own',
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then((response) => {
      const datatsets = response.data.records.map((record) => record.title);
      runInAction(() => {
        this.datasets = datatsets;
        this.loading = false;
      });
    });
  }

  setDataset(dataset) {
    runInAction(() => {
      this.dataset = dataset;
    });
  }

  submitDataset() {
    axios
      .post('/target/', {
        dataset_id: this.dataset,
        api_token: this.token
      })
      .then((response) => {
        console.log('Final response', response);
      });
  }
}

export default new User();
