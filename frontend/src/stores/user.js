import { extendObservable, runInAction } from 'mobx';
import axios from 'axios';

class User {
  constructor() {
    extendObservable(this, {
      token: ''
    });
  }

  getToken(code) {
    axios
      .post('/access_token/', {
        code
      })
      .then((response) => {
        runInAction(() => {
          this.token = JSON.parse(response.data).access_token;
        });
      });
  }
}

export default new User();
