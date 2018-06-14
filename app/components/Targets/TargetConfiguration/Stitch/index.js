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
// @flow

import React, { Component } from 'react';
import { Label, Input, FormFeedback, FormGroup, InputGroup } from 'reactstrap';

import styles from './Stitch.css';

type Props = {
  userStore: {
    'target-stitch': {
      fieldValues: { client_id: number | string, token: string }
    }
  },
  updateTargetField: (target: string, name: string, value: string) => void
};

type State = {
  client_id: {},
  token: {}
};

export default class Stitch extends Component<Props, State> {
  state = {
    client_id: {},
    token: {}
  };

  validate = (field: string, value: string) => {
    if (value) {
      this.setState({ [field]: { valid: true } });
    } else {
      this.setState({ [field]: { invalid: true } });
    }
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: { valid: true } });
    this.props.updateTargetField('target-stitch', name, value);
  };

  render() {
    // eslint-disable-next-line
    const { client_id, token } = this.props.userStore[
      'target-stitch'
    ].fieldValues;
    return (
      <div className={styles.Stitch}>
        <FormGroup>
          <Label for="apiToken">Client ID</Label>
          <InputGroup>
            <Input
              name="client_id"
              onChange={this.handleChange}
              value={client_id}
              onBlur={(event) => {
                const { value } = event.currentTarget;
                this.validate('client_id', value);
              }}
              {...this.state.client_id}
            />
            <FormFeedback>Required</FormFeedback>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="token">Token</Label>
          <InputGroup>
            <Input
              name="token"
              type="password"
              onChange={this.handleChange}
              value={token}
              onBlur={(event) => {
                const { value } = event.currentTarget;
                this.validate('token', value);
              }}
              {...this.state.token}
            />
            <FormFeedback>Required</FormFeedback>
          </InputGroup>
        </FormGroup>
      </div>
    );
  }
}
