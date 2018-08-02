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
import type {
  TapAdwords,
  UpdateTapField,
  AdwordsState,
  UpdateFormValidation
} from '../../../../utils/sharedTypes';
import {
  openLink,
  toISODateString,
  formatDate,
  validateFields,
  formValid,
  showValidation
} from '../../../../utils/handlers';

type Props = {
  tapsStore: {
    'tap-adwords': TapAdwords
  },
  updateTapField: UpdateTapField,
  updateFormValidation: UpdateFormValidation
};

export default class Adwords extends Component<Props, AdwordsState> {
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
    developer_token: { validation: {}, errorMessage: 'Required' },
    oauth_client_id: { validation: {}, errorMessage: 'Required' },
    oauth_client_secret: { validation: {}, errorMessage: 'Required' },
    refresh_token: { validation: {}, errorMessage: 'Required' },
    start_date: { validation: {}, errorMessage: 'Required' },
    customer_ids: { validation: {}, errorMessage: 'Required' },
    user_agent: { validation: {}, errorMessage: '' }
  };

  componentWillReceiveProps(nextProps: Props) {
    const { fieldValues } = nextProps.tapsStore['tap-adwords'];
    this.setState(validateFields(fieldValues, this.state));
  }

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
    const { valid } = this.props.tapsStore['tap-adwords'];
    const validationState = formValid(this.state);

    if (valid !== validationState) {
      this.props.updateFormValidation('tap-adwords', validationState);
    }

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
                    this.setState({
                      developer_token: Object.assign(
                        this.state.developer_token,
                        {
                          validation: {}
                        }
                      )
                    });
                  }}
                  onBlur={() => {
                    this.setState(
                      showValidation('developer_token', this.state)
                    );
                  }}
                  onChange={this.handleChange}
                  {...this.state.developer_token.validation}
                />
                <FormFeedback>
                  {this.state.developer_token.errorMessage}
                </FormFeedback>
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
                    this.setState({
                      customer_ids: Object.assign(this.state.customer_ids, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('customer_ids', this.state));
                  }}
                  onChange={this.handleChange}
                  {...this.state.customer_ids.validation}
                />
                <FormText>
                  Comma separated AdWords account IDs to replicate data from.
                </FormText>
                <FormFeedback>
                  {this.state.customer_ids.errorMessage}
                </FormFeedback>
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
                    this.setState({
                      oauth_client_id: Object.assign(
                        this.state.oauth_client_id,
                        {
                          validation: {}
                        }
                      )
                    });
                  }}
                  onBlur={() => {
                    this.setState(
                      showValidation('oauth_client_id', this.state)
                    );
                  }}
                  onChange={this.handleChange}
                  {...this.state.oauth_client_id.validation}
                />
                <FormFeedback>
                  {this.state.oauth_client_id.errorMessage}
                </FormFeedback>
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
                    this.setState({
                      oauth_client_secret: Object.assign(
                        this.state.oauth_client_secret,
                        {
                          validation: {}
                        }
                      )
                    });
                  }}
                  onBlur={() => {
                    this.setState(
                      showValidation('oauth_client_secret', this.state)
                    );
                  }}
                  onChange={this.handleChange}
                  {...this.state.oauth_client_secret.validation}
                />
                <FormFeedback>
                  {this.state.oauth_client_secret.errorMessage}
                </FormFeedback>
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
                      {...this.state.refresh_token.validation}
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
                  onFocus={() => {
                    this.setState({
                      start_date: Object.assign(this.state.start_date, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('start_date', this.state));
                  }}
                  onChange={this.handleChange}
                  {...this.state.start_date.validation}
                />
                <FormText>
                  Applies to objects with a defined timestamp field and limits
                  how much historical data will be replicated.
                </FormText>
                <FormFeedback>
                  {this.state.start_date.errorMessage}
                </FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}
