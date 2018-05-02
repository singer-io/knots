// @flow
import React, { Component } from 'react';
import {
  Label,
  Input,
  InputGroupText,
  FormFeedback,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Button
} from 'reactstrap';
import { ipcRenderer } from 'electron';

import styles from './DataWorld.css';

type Props = {
  setToken: (token: string) => void,
  userStore: { token: string, selectedDataset: string },
  setDataset: (value: string) => void
};

export default class DataWorld extends Component<Props> {
  constructor() {
    super();

    ipcRenderer.on('dataworld-oauth-reply', (event, token) => {
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
    this.props.setDataset(value);
  };

  showDatasetSelector = () => {
    const options = {
      client_id: 'knot-local'
    };

    const datasetSelector = new window.dataworldWidgets.DatasetSelector(
      options
    );

    datasetSelector.success((datasets) => {
      const selectedDataset = datasets[0];
      this.props.setDataset(`${selectedDataset.owner}/${selectedDataset.id}`);
    });

    datasetSelector.show();
  };

  validDataset() {
    const datasetArray = this.props.userStore.selectedDataset.split('/');

    if (datasetArray.length !== 2) {
      return false;
    }

    return true;
  }

  render() {
    const { token } = this.props.userStore;
    return (
      <div className={styles.DataWorld}>
        <FormGroup>
          <Label for="apiToken">API Token</Label>
          <InputGroup>
            <Input readOnly value={token} invalid={!token} />
            <InputGroupAddon addonType="append">
              <Button outline color="secondary" onClick={this.authorize}>
                Authenticate
              </Button>
            </InputGroupAddon>
            <FormFeedback>Required</FormFeedback>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="datasetUrl">Dataset URL</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>https://data.world/</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="jonloyens/intro-to-dataworld-dataset"
              value={this.props.userStore.selectedDataset}
              onChange={this.handleChange}
              invalid={!this.validDataset()}
            />
            <InputGroupAddon addonType="append">
              <Button
                outline
                color="secondary"
                onClick={this.showDatasetSelector}
              >
                Search
              </Button>
            </InputGroupAddon>
            <FormFeedback>Required</FormFeedback>
          </InputGroup>
        </FormGroup>
      </div>
    );
  }
}
