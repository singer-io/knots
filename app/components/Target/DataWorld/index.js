// @flow
import React, { Component } from 'react';
import { Label, Input, InputGroupText } from 'reactstrap';
import { ipcRenderer } from 'electron';

import styles from './DataWorld.css';

type Props = {
  setToken: (token: string) => void,
  userStore: { token: string },
  setDataset: (value: string) => void
};

export default class DataWorld extends Component<Props> {
  constructor() {
    super();

    ipcRenderer.on('dataworld-oauth-reply', (event, token) => {
      console.log(token.access_token);
      this.setToken(token.access_token);
    });
  }

  authorize = () => {
    ipcRenderer.send('dataworld-oauth', 'getToken');
  };

  setToken = (token: string) => {
    this.props.setToken(token);
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    console.log('Called');
    this.props.setDataset(value);
  };

  render() {
    console.log('The dw props', this.props);
    return (
      <div className={styles.DataWorld}>
        <Label for="apiToken">API Token</Label>
        <div className={styles.targetFields}>
          <Input readOnly value={this.props.userStore.token} />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={this.authorize}
          >
            Authenticate
          </button>
        </div>
        <Label for="apiToken">Dataset URL</Label>
        <div className={styles.targetFields}>
          <InputGroupText>https://data.world/</InputGroupText>
          <Input
            placeholder="jonloyens/intro-to-dataworld-dataset"
            onChange={this.handleChange}
          />

          <button className="btn btn-outline-secondary" type="button">
            Search
          </button>
        </div>
      </div>
    );
  }
}
