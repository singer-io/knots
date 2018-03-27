// @flow

import React, { Component } from 'react';
import { Button, FormControl, ControlLabel } from 'react-bootstrap';

import styles from './DataWorld.css';

type Props = {
  userStore: { token: string, datasets: Array<string> },
  getDatasets: (token: string) => void,
  setDataset: (value: string) => void
};

export default class DataWorld extends Component<Props> {
  componentWillMount() {
    if (this.props.userStore.token) {
      this.props.getDatasets(this.props.userStore.token);
    }
  }

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    this.props.setDataset(value);
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
          </div>
        )}
        {!this.props.userStore.token && (
          <div>
            <div className={styles.buttonLabel}>API Token</div>
            <a href="https://data.world/oauth/authorize?client_id=knot-local&redirect_uri=http://localhost:3000/callback&response_type=code">
              <Button bsStyle="primary">Log in with data.world</Button>
            </a>
          </div>
        )}
        <div>
          <ControlLabel>Dataset</ControlLabel>
          <select onChange={this.handleChange}>
            {this.props.userStore.datasets.map((dataset) => (
              <option key={dataset} value={dataset}>
                {dataset}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}
