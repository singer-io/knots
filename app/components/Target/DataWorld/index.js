// @flow

import React, { Component } from 'react';
import { Button, FormControl, ControlLabel } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import Datasets from './Datasets';

import styles from './DataWorld.css';

type Props = {
  userStore: { token: string, datasets: Array<{ id: string }> },
  tapsStore: { knot: string },
  getDatasets: (token: string) => void,
  setDataset: (value: string) => void,
  setToken: (token: string) => void,
  fetchToken: (knot: string) => void
};

export default class DataWorld extends Component<Props> {
  props: Props;
  constructor() {
    super();

    ipcRenderer.on('dataworld-oauth-reply', (event, token) => {
      this.setToken(token.access_token);
    });
  }
  componentWillMount() {
    this.props.fetchToken(this.props.tapsStore.knot);
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
            />{' '}
            <Button bsStyle="primary" onClick={this.authorize}>
              Reset Token
            </Button>
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
