// @flow
import React, { Component } from 'react';
import { Label, Input, InputGroupText } from 'reactstrap';

import styles from './DataWorld.css';

export default class DataWorld extends Component<{}> {
  render() {
    return (
      <div className={styles.DataWorld}>
        <Label for="apiToken">API Token</Label>
        <div className={styles.targetFields}>
          <Input readOnly />
          <button className="btn btn-outline-secondary" type="button">
            Authenticate
          </button>
        </div>
        <Label for="apiToken">Dataset URL</Label>
        <div className={styles.targetFields}>
          <InputGroupText>https://data.world/</InputGroupText>
          <Input placeholder="jonloyens/intro-to-dataworld-dataset" />

          <button className="btn btn-outline-secondary" type="button">
            Search
          </button>
        </div>
      </div>
    );
  }
}
