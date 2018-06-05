// @flow
/* eslint-disable camelcase */
/*
 * Knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */

import React, { Component } from 'react';
import { Label, Input, FormFeedback, FormGroup, InputGroup } from 'reactstrap';

import styles from './Stitch.css';

type Props = {
  userStore: {
    'target-stitch': {
      fieldValues: { client_id: number | string, token: string }
    }
  },
  updateField: (target: string, name: string, value: string) => void
};

type State = {
  formState: {},
  targetValues: { 'target-stitch': { fieldValues: {} } }
};

export default class Stitch extends Component<Props, State> {
  state = {
    formState: {},
    targetValues: { 'target-stitch': { fieldValues: {} } }
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { targetValues } = this.state;
    targetValues['target-stitch'].fieldValues[name] = value;
    this.props.updateField(targetValues);
  };

  handleBlur = (e, key) => {
    const { formState } = this.state;
    formState[key] = e.target.value !== '';
    this.setState({ formState });
  };

  getValidState = (key) => {
    const { formState } = this.state;
    return formState[key] !== undefined ? formState[key] : true;
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
              onBlur={(e) => this.handleBlur(e, 'client_id')}
              name="client_id"
              onChange={this.handleChange}
              value={client_id}
              invalid={!this.getValidState('client_id') && !client_id}
              valid={this.getValidState('client_id') || !!client_id}
            />
            <FormFeedback>Required</FormFeedback>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="apiToken">Token</Label>
          <InputGroup>
            <Input
              onBlur={(e) => this.handleBlur(e, 'token')}
              name="token"
              type="password"
              onChange={this.handleChange}
              value={token}
              invalid={!this.getValidState('token') && !token}
              valid={this.getValidState('token') || !!token}
            />
            <FormFeedback>Required</FormFeedback>
          </InputGroup>
        </FormGroup>
      </div>
    );
  }
}
