// @flow
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
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  InputGroupAddon,
  InputGroup
} from 'reactstrap';
import { ipcRenderer } from 'electron';

type Props = {
  fields: Array<{
    key: string,
    label: string,
    validationText: string,
    required: boolean,
    placeholder: string,
    options: Array<string>,
    type?: string
  }>,
  fieldValues: {
    password?: string,
    client_id?: string,
    client_secret?: string,
    refresh_token?: string,
    api_type?: string,
    select_fields_by_default?: boolean
  },
  handleChange: (event: SyntheticEvent<HTMLButtonElement>) => void,
  setSfRefreshToken: (token: string) => void
};

export default class ConfigureForm extends Component<Props> {
  constructor() {
    super();

    ipcRenderer.on('sf-oauth-reply', (event, token) => {
      this.props.setSfRefreshToken(token.refresh_token);
    });

    this.state = {
      formState: {}
    };
  }

  authorize = (clientId?: string, clientSecret?: string) => {
    const authorizationCredentials = { clientId, clientSecret };
    ipcRenderer.send('sf-oauth', authorizationCredentials);
  };

  onGetRefreshToken = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const clientId = this.props.fieldValues.client_id;
    const clientSecret = this.props.fieldValues.client_secret;
    this.authorize(clientId, clientSecret);
  };

  handleChange = (e, config) => {
    const { formState } = this.state;
    const { key } = config;
    formState[key] = e.target.value !== '';

    this.setState({ formState }, this.props.handleChange(e));
  };

  getValidState = (key) => {
    const { formState } = this.state;
    return formState[key] !== undefined ? formState[key] : true;
  };

  render() {
    return (
      <Form>
        {this.props.fields.map((field) => (
          <FormGroup key={field.key}>
            <Label for={field.label}>{field.label}</Label>
            <InputGroup>
              {field.type === 'select' ? (
                <Input
                  onBlur={(e) => this.handleChange(e, field)}
                  readOnly={field.key === 'refresh_token'}
                  type={field.type}
                  name={field.key}
                  value={this.props.fieldValues[field.key] || ''}
                  id={field.label}
                  onChange={(e) => this.handleChange(e, field)}
                  invalid={!this.getValidState(field.key)}
                  valid={this.getValidState(field.key)}
                  placeholder={field.required ? '' : field.placeholder}
                >
                  <option value="" />
                  {field.options.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </Input>
              ) : (
                <Input
                  onBlur={(e) => this.handleChange(e, field)}
                  readOnly={
                    field.key === 'refresh_token' ||
                    field.key === 'api_type' ||
                    field.key === 'select_fields_by_default'
                  }
                  type={field.type}
                  name={field.key}
                  value={this.props.fieldValues[field.key] || ''}
                  id={field.label}
                  onChange={(e) => this.handleChange(e, field)}
                  invalid={!this.getValidState(field.key)}
                  valid={this.getValidState(field.key)}
                  placeholder={field.required ? '' : field.placeholder}
                />
              )}
              {field.key === 'refresh_token' && (
                <InputGroupAddon addonType="append">
                  <Button
                    disabled={
                      !(
                        this.props.fieldValues.client_id &&
                        this.props.fieldValues.client_secret
                      ) || !!this.props.fieldValues.refresh_token
                    }
                    outline
                    color="secondary"
                    onClick={(e) => {
                      this.onGetRefreshToken(e);
                    }}
                  >
                    Get token
                  </Button>
                </InputGroupAddon>
              )}
              <FormFeedback>{field.validationText}</FormFeedback>
            </InputGroup>
          </FormGroup>
        ))}
      </Form>
    );
  }
}
