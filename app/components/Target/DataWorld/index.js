// @flow

import React, { Component } from 'react';
import { Button, FormControl, ControlLabel } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import Datasets from './Datasets';

import styles from './DataWorld.css';

type Props = {
  userStore: { token: string, datasets: Array<{ id: string }> },
  getDatasets: (token: string) => void,
  setDataset: (value: string) => void,
  setToken: (token: string) => void
};

export default class DataWorld extends Component<Props> {
  props: Props;
  constructor() {
    super();

    ipcRenderer.on('dataworld-oauth-reply', (event, token) => {
      console.log('It has happened', token.access_token);
      this.setToken(token.access_token);
    });
  }

  setToken = (token: string) => {
    this.props.setToken(token);
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    this.props.setDataset(value);
  };

  authorize = () => {
    ipcRenderer.send('dataworld-oauth', 'getToken');
  };

  render() {
    return (
      <div className={styles.DataWorld}>
        {this.props.userStore.token && (
          <div>
            <ControlLabel className={styles.ControlLabel}>
              API Token
            </ControlLabel>
            <FormControl
              name="dataset"
              type="text"
              value={this.props.userStore.token}
              readOnly
            />
            <Datasets
              datasets={this.props.userStore.datasets}
              handleChange={this.handleChange}
              getDatasets={this.props.getDatasets}
              token={this.props.userStore.token}
            />
          </div>
        )}
        {!this.props.userStore.token && (
          <div>
            <div>
              <div className={styles.buttonLabel}>API Token</div>
              <Button bsStyle="primary" onClick={this.authorize}>
                Log in with data.world
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
