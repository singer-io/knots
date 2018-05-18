// @flow
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
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
  updateField: (target: string, field: string, value: string) => void
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
    this.props.updateField('target-datadotworld', 'api_token', token);
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    this.props.updateField('target-datadotworld', name, value);
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

      this.props.updateField(
        'target-datadotworld',
        'dataset_id',
        selectedDataset.id
      );

      this.props.updateField(
        'target-datadotworld',
        'dataset_owner',
        selectedDataset.owner
      );
    });

    datasetSelector.show();
  };

  validDataset = (id?: string, owner?: string) => {
    if (id && owner) {
      return true;
    }

    return false;
  };

  getDataset = (id?: string, owner?: string) => {
    if (id && owner) {
      return `${id}/${owner}`;
    }

    return '';
  };

  render() {
    // $FlowFixMe
    const { dataset_id, dataset_owner, api_token } = this.props.userStore[
      'target-datadotworld'
    ].fieldValues;
    return (
      <div className={styles.DataWorld}>
        <FormGroup>
          <Label for="apiToken">API Token</Label>
          <InputGroup>
            <Input
              readOnly
              type="password"
              value={api_token}
              invalid={!api_token}
            />
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
              name="dataset"
              placeholder="jonloyens/intro-to-dataworld-dataset"
              value={this.getDataset(dataset_id, dataset_owner)}
              onChange={this.handleChange}
              invalid={!this.validDataset(dataset_id, dataset_owner)}
              disabled
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
