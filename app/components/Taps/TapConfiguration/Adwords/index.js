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
import { tapPropertiesType } from '../../../../utils/shared-types';

type Props = {
  tapsStore: {
    selectedTap: tapPropertiesType,
    'tap-adwords': {
      fieldValues: {
        developer_token: string,
        oauth_client_id: string,
        oauth_client_secret: string,
        refresh_token: string,
        start_date: string,
        user_agent: string,
        customer_ids: string
      }
    }
  },
  updateTapField: (tap: string, field: string, value: string) => void
};

type State = {
  developer_token: {},
  oauth_client_id: {},
  oauth_client_secret: {},
  refresh_token: {},
  start_date: {},
  user_agent: {},
  customer_ids: {}
};

export default class Adwords extends Component<Props, State> {
  constructor() {
    super();

    ipcRenderer.on('adwords-oauth-reply', (event, token) => {
      this.props.updateTapField(
        'tap-adwords',
        'refresh_token',
        token.refresh_token
      );
    });
  }

  state = {
    developer_token: {},
    oauth_client_id: {},
    oauth_client_secret: {},
    refresh_token: {},
    start_date: {},
    user_agent: { valid: true },
    customer_ids: {}
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

    this.props.updateTapField('tap-adwords', name, value);
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
    const { oauth_client_id, oauth_client_secret } = this.props.tapsStore[
      'tap-adwords'
    ].fieldValues;
    ipcRenderer.send('adwords-oauth', oauth_client_id, oauth_client_secret);
  };

  openLink = (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  };

  render() {
    const {
      developer_token,
      oauth_client_id,
      oauth_client_secret,
      refresh_token,
      start_date,
      user_agent,
      customer_ids
    } = this.props.tapsStore['tap-adwords'].fieldValues;

    return (
      <Container>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <Label for="client_id">Developer token</Label>
                <Input
                  type="text"
                  name="developer_token"
                  id="developer_token"
                  value={developer_token}
                  onFocus={() => {
                    this.setState({ developer_token: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('developer_token', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.developer_token}
                />
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="client_id">
                  User agent <small>(optional)</small>
                </Label>
                <Input
                  type="text"
                  name="user_agent"
                  id="user_agent"
                  value={user_agent}
                  onChange={this.handleChange}
                  {...this.state.user_agent}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="client_secret">Client ID</Label>
                <Input
                  type="text"
                  name="oauth_client_id"
                  id="oauth_client_id"
                  value={oauth_client_id}
                  onFocus={() => {
                    this.setState({ oauth_client_id: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('oauth_client_id', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.oauth_client_id}
                />
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="client_secret">Client secret</Label>
                <Input
                  type="password"
                  name="oauth_client_secret"
                  id="oauth_client_secret"
                  value={oauth_client_secret}
                  onFocus={() => {
                    this.setState({ oauth_client_secret: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('oauth_client_secret', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.oauth_client_secret}
                />
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Collapse isOpen={!!(oauth_client_id && oauth_client_secret)}>
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
                        disabled={!(oauth_client_id && oauth_client_secret)}
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
            <Col>
              <FormGroup>
                <Label for="client_id">Customer ID</Label>
                <Input
                  type="text"
                  name="customer_ids"
                  id="customer_ids"
                  value={customer_ids}
                  onFocus={() => {
                    this.setState({ customer_ids: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('customer_ids', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.customer_ids}
                />
                <FormText>
                  Comma separated AdWords account IDs to replicate data from.
                </FormText>
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
            <Col>
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
