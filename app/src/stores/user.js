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
      .post('/token/', {
        code
      })
      .then((response) => {
        console.log('This is the response', response);
        runInAction(() => {
          this.token = response.data.token;
          this.loading = false;
        });
      });
  }

  getDatasets() {
    runInAction(() => {
      this.loading = true;
    });
    let datasets = [];
    Promise.all([
      axios({
        method: 'GET',
        url: 'https://api.data.world/v0/user/datasets/own',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }),
      axios({
        method: 'GET',
        url: 'https://api.data.world/v0/user/datasets/contributing',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
    ]).then((results) => {
      results.forEach((result) => {
        datasets = datasets.concat(result.data.records);
      });

      // Only display projects for which the user has write rights
      datasets = datasets.filter((dataset) => {
        const { accessLevel } = dataset;
        if (accessLevel === 'ADMIN' || accessLevel === 'WRITE') {
          return true;
        }

        return false;
      });
      runInAction(() => {
        const defaultDataset = datasets[0];
        this.datasets = datasets;
        this.dataset = defaultDataset;
        this.loading = false;
      });
    });
  }

  setDataset(datasetIndex) {
    runInAction(() => {
      this.dataset = this.datasets[datasetIndex];
    });
  }

  submitFields() {
    axios
      .post('/target/', {
        dataset_id: this.dataset.id,
        api_token: this.token
      })
      .then(() => {});
  }
}

export default new User();
