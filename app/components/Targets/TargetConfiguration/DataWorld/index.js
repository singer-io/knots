/*
 * knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the
 * License.
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc.(http://data.world/).
 */

/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
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

type Props = {
  updateTargetField: (target: string, field: string, value: string) => void
};

type State = {
  api_token: {},
  dataset: {}
};

export default class DataWorld extends Component<Props, State> {
  constructor() {
    super();

    ipcRenderer.on('dataworld-oauth-reply', (event, token) => {
      this.setToken(token.access_token);
    });
  }

  state = {
    api_token: {},
    dataset: {}
  };

  componentWillReceiveProps(nextProps: Props) {
    // $FlowFixMe
    const { dataset_id, dataset_owner, api_token } = nextProps.userStore[
      'target-datadotworld'
    ].fieldValues;

    this.setState({
      api_token: { valid: !!api_token },
      dataset: { valid: !!(dataset_id && dataset_owner) }
    });
  }

  authorize = () => {
    ipcRenderer.send('dataworld-oauth', 'getToken');
  };

  setToken = (token: string) => {
    this.props.updateTargetField('target-datadotworld', 'api_token', token);
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: { valid: true } });
    this.props.updateTargetField('target-datadotworld', name, value);
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

      this.props.updateTargetField(
        'target-datadotworld',
        'dataset_id',
        selectedDataset.id
      );

      this.props.updateTargetField(
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
      return `${owner}/${id}`;
    }

    return '';
  };

  getDataset = (id?: string, owner?: string) => {
    if (id && owner) {
      return `${owner}/${id}`;
    }

    return '';
  };

  render() {
    // $FlowFixMe
    const { dataset_id, dataset_owner, api_token } = this.props.userStore[
      'target-datadotworld'
    ].fieldValues;
    return (
      <div className="w-100">
        <FormGroup>
          <Label for="apiToken">API Token</Label>
          <InputGroup>
            <Input
              name="api_token"
              readOnly
              type="password"
              value={api_token}
              {...this.state.api_token}
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
              disabled
              {...this.state.dataset}
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
