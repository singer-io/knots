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

import classNames from 'classnames';
import React, { Component } from 'react';
import {
  Button,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  Label
} from 'reactstrap';
import { openLink } from '../../../../utils/handlers';

type Props = {
  updateTargetField: (target: string, field: string, value: string) => void
};

type State = {
  api_token: {},
  dataset_url: { valid?: boolean, invalid?: boolean }
};

export default class DataWorld extends Component<Props, State> {
  constructor() {
    super();

    this.state = {
      api_token: {},
      dataset_url: {}
    };
  }

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    this.props.updateTargetField('target-datadotworld', name, value);
    this.setState({ [name]: { valid: !!value, invalid: !value } });
  };

  extractDatasetParams = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const dsPattern = /^(https?:\/\/data\.world\/)?([^/?#]+)\/([^/?#]+)[/?#]?/g;
    const result = dsPattern.exec(value);
    if (result && result.length > 3) {
      this.props.updateTargetField(
        'target-datadotworld',
        'dataset_owner',
        result[2]
      );
      this.props.updateTargetField(
        'target-datadotworld',
        'dataset_id',
        result[3]
      );
      this.props.updateTargetField(
        'target-datadotworld',
        'dataset_url',
        `${result[2]}/${result[3]}`
      );
    } else {
      this.setState({ dataset_url: { valid: false, invalid: true } });
    }
  };

  showDatasetSelector = () => {
    const options = {
      client_id: 'knot-local',
      linkText: 'Select'
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

      this.props.updateTargetField(
        'target-datadotworld',
        'dataset_url',
        `${selectedDataset.owner}/${selectedDataset.id}`
      );

      this.setState({ dataset_url: { valid: true, invalid: false } });
    });

    datasetSelector.show();
  };

  render() {
    // $FlowFixMe
    const { dataset_url, api_token } = this.props.userStore[
      'target-datadotworld'
    ].fieldValues;
    return (
      <div className="w-100">
        <FormGroup>
          <Label for="dataset_url">Dataset URL</Label>
          <div className="d-flex">
            <InputGroup className="flex-fill mr-2">
              <InputGroupAddon addonType="prepend">
                https://data.world/
              </InputGroupAddon>
              <Input
                name="dataset_url"
                value={dataset_url}
                onChange={this.handleChange}
                onBlur={this.extractDatasetParams}
                {...this.state.dataset_url}
              />
            </InputGroup>
            <Button
              outline
              color="secondary"
              onClick={this.showDatasetSelector}
            >
              Browse
            </Button>
          </div>
          <FormText>
            Copy/paste the URL of the desired dataset, or simply click
            &quot;Browse&quot;
          </FormText>
          <p
            className={classNames('text-danger', {
              'd-none': !this.state.dataset_url.invalid
            })}
          >
            <small>Must be a valid data.world dataset URL</small>
          </p>
        </FormGroup>
        <FormGroup>
          <Label for="api_token">API Token</Label>
          <Input
            name="api_token"
            type="password"
            value={api_token}
            onChange={this.handleChange}
            {...this.state.api_token}
          />
          <FormText>
            Copy/paste your read/write API token from&nbsp;
            <a href="https://data.world/settings/advanced" onClick={openLink}>
              https://data.world/settings/advanced
            </a>
          </FormText>
          <FormFeedback>Required</FormFeedback>
        </FormGroup>
      </div>
    );
  }
}
