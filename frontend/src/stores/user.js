import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';

class User {
  constructor() {
    extendObservable(this, {
      datasets: [],
      token: ''
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
          this.token = JSON.parse(response.data).access_token;
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
}

export default new User();
