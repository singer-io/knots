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
import { ipcRenderer } from 'electron';
import type { TapPropertiesType } from '../../../../utils/sharedTypes';
import {
  openLink,
  toISODateString,
  formatDate
} from '../../../../utils/handlers';

type Props = {
  tapsStore: {
    selectedTap: TapPropertiesType,
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
    customer_ids: {}
  };

  validate = (field: string, value: string) => {
    if (value) {
      this.setState({ [field]: { valid: true } });
    } else {
      this.setState({ [field]: { invalid: true } });
    }
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    let { value } = e.currentTarget;

    if (name === 'start_date') {
      value = toISODateString(new Date(value));
    }

    this.props.updateTapField('tap-adwords', name, value);
  };

  authorize = () => {
    const { oauth_client_id, oauth_client_secret } = this.props.tapsStore[
      'tap-adwords'
    ].fieldValues;
    ipcRenderer.send('adwords-oauth', oauth_client_id, oauth_client_secret);
  };

  render() {
    const {
      developer_token,
      oauth_client_id,
      oauth_client_secret,
      refresh_token,
      start_date,
      customer_ids
    } = this.props.tapsStore['tap-adwords'].fieldValues;

    return (
      <Container>
        <Alert color="primary">
          <h4>Shhh... Here is a secret!</h4>
          <p>
            This Tap requires you to have requested and have access to Adwords
            API. That will give you access to the Developer token required
            below. To request for access, please follow&nbsp;
            <a
              href="https://developers.google.com/adwords/api/docs/guides/signup"
              onClick={openLink}
            >
              this guide
            </a>.
          </p>
          <p>
            Once you are signed in to your&nbsp;
            <a
              href="https://ads.google.com/home/tools/manager-accounts/"
              onClick={openLink}
            >
              manager account
            </a>, you will have access to the Customer ID
          </p>
          <p>
            It also requires you to generate OAuth2 credentials. This will give
            you access to the Client ID and Client secret required below. To
            generate OAuth2 credentials, please follow&nbsp;
            <a
              href="https://developers.google.com/adwords/api/docs/guides/authentication#installed"
              onClick={openLink}
            >
              this guide
            </a>.
          </p>
        </Alert>
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
            <Col xs="6">
              <FormGroup>
                <Label for="start_date">Start date</Label>
                <Input
                  type="date"
                  name="start_date"
                  id="start_date"
                  value={start_date ? formatDate(start_date) : ''}
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
