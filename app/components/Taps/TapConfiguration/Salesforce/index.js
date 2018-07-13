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

// @flow
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */

import React, { Component } from 'react';
import {
  Alert,
  Button,
  Col,
  Collapse,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row
} from 'reactstrap';
import { ipcRenderer, shell } from 'electron';

type Props = {
  tapsStore: {
    selectedTap: { name: string, image: string },
    'tap-salesforce': {
      fieldValues: {
        client_id: string,
        client_secret: string,
        refresh_token: string,
        start_date: string
      }
    }
  },
  updateTapField: (tap: string, field: string, value: string) => void
};

type State = {
  client_id: {},
  client_secret: {},
  refresh_token: {},
  start_date: {}
};

export default class Salesforce extends Component<Props, State> {
  constructor() {
    super();

    ipcRenderer.on('sf-oauth-reply', (event, token) => {
      this.props.updateTapField(
        'tap-salesforce',
        'refresh_token',
        token.refresh_token
      );
    });
  }

  state = {
    client_id: {},
    client_secret: {},
    refresh_token: {},
    start_date: {}
  };

  validate = (field: string, value: string) => {
    if (value) {
      this.setState({ [field]: { valid: true } });
    } else {
      this.setState({ [field]: { invalid: true } });
    }
  };

  toISODateString = (date: Date) => {
    const pad = (number) => (number < 10 ? `0${number}` : number);

    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
      date.getUTCDate()
    )}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
      date.getUTCSeconds()
    )}Z`;
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    let { value } = e.currentTarget;

    if (name === 'start_date') {
      value = this.toISODateString(new Date(value));
    }

    this.props.updateTapField('tap-salesforce', name, value);
  };

  formatDate = (ISODate: string) => {
    const date = new Date(ISODate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
  };

  authorize = () => {
    const { client_id, client_secret } = this.props.tapsStore[
      'tap-salesforce'
    ].fieldValues;
    ipcRenderer.send('sf-oauth', client_id, client_secret);
  };

  openLink = (e: SyntheticEvent<HTMLButtonElement>, url: string) => {
    e.preventDefault();
    shell.openExternal(url);
  };

  render() {
    const {
      client_id,
      client_secret,
      refresh_token,
      start_date
    } = this.props.tapsStore['tap-salesforce'].fieldValues;

    return (
      <Container>
        <Alert color="primary">
          <h4>Shhh... Here is a secret!</h4>
          <p>
            This Tap requires you to provision your own SalesForce Connected
            App. That will give you access to the consumer key and secret
            required below. To do so, please follow&nbsp;
            <a
              href="#"
              onClick={(e) =>
                this.openLink(
                  e,
                  'https://help.salesforce.com/articleView?id=connected_app_create.htm&type=5'
                )
              }
            >
              this guide
            </a>.
          </p>
          <p>
            You must select <strong>Enable OAuth settings</strong> and specify
            the following options:
          </p>
          <ol>
            <li>
              Callback URL:{' '}
              <code>https://login.salesforce.com/services/oauth2/success</code>
            </li>
            <li>
              Selected OAuth Scopes:
              <ul>
                <li>
                  <code>Access and manage your data (api)</code>
                </li>
                <li>
                  <code>
                    Perform requests on your behalf at any time (refresh_token,
                    offline_access)
                  </code>
                </li>
              </ul>
            </li>
          </ol>
        </Alert>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <Label for="client_id">Consumer key</Label>
                <Input
                  type="text"
                  name="client_id"
                  id="client_id"
                  value={client_id}
                  onFocus={() => {
                    this.setState({ client_id: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('client_id', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.client_id}
                />
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="client_secret">Consumer secret</Label>
                <Input
                  type="password"
                  name="client_secret"
                  id="client_secret"
                  value={client_secret}
                  onFocus={() => {
                    this.setState({ client_secret: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('client_secret', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.client_secret}
                />
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Collapse isOpen={!!(client_id && client_secret)}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="refresh_token">Refresh token</Label>
                  <InputGroup>
                    <Input
                      readOnly
                      type="password"
                      name="refresh_token"
                      value={refresh_token}
                      id="refresh_token"
                      onChange={this.handleChange}
                      {...this.state.refresh_token}
                    />
                    <InputGroupAddon addonType="append">
                      <Button
                        disabled={!(client_id && client_secret)}
                        outline
                        color="secondary"
                        onClick={this.authorize}
                      >
                        Get token
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
          </Collapse>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label for="start_date">Start date</Label>
                <Input
                  type="date"
                  name="start_date"
                  id="start_date"
                  value={start_date ? this.formatDate(start_date) : ''}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('start_date', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.start_date}
                />
                <FormText>
                  Applies to objects with a defined timestamp field and limits
                  how much historical data will be replicated.
                </FormText>
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}
