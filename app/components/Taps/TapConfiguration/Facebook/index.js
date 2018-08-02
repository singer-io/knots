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
import {
  toISODateString,
  formatDate,
  openLink,
  formValid,
  showValidation,
  validateFields
} from '../../../../utils/handlers';
import type {
  TapFacebook,
  UpdateTapField,
  UpdateFormValidation,
  FacebookState
} from '../../../../utils/sharedTypes';

type Props = {
  tapsStore: {
    'tap-facebook': TapFacebook
  },
  updateTapField: UpdateTapField,
  updateFormValidation: UpdateFormValidation
};

export default class Facebook extends Component<Props, FacebookState> {
  constructor() {
    super();

    ipcRenderer.on('fb-oauth-reply', (event, token) => {
      this.props.updateTapField(
        'tap-facebook',
        'access_token',
        token.access_token
      );
    });
  }

  state = {
    access_token: { validation: {}, errorMessage: 'Required' },
    account_id: { validation: {}, errorMessage: 'Required' },
    app_id: { validation: {}, errorMessage: 'Required' },
    app_secret: { validation: {}, errorMessage: 'Required' },
    start_date: { validation: {}, errorMessage: 'Required' }
  };

  componentWillReceiveProps(nextProps: Props) {
    const { fieldValues } = nextProps.tapsStore['tap-facebook'];
    this.setState(validateFields(fieldValues, this.state));
  }

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    let { value } = e.currentTarget;

    if (name === 'start_date') {
      value = toISODateString(new Date(value));
    }

    this.props.updateTapField('tap-facebook', name, value);
  };

  authorize = () => {
    const { app_id, app_secret } = this.props.tapsStore[
      'tap-facebook'
    ].fieldValues;
    ipcRenderer.send('fb-authenticate', app_id, app_secret);
  };

  render() {
    const {
      access_token,
      account_id,
      app_id,
      app_secret,
      start_date
    } = this.props.tapsStore['tap-facebook'].fieldValues;
    const { valid } = this.props.tapsStore['tap-facebook'];
    const validationState = formValid(this.state);

    if (valid !== validationState) {
      this.props.updateFormValidation('tap-facebook', validationState);
    }

    return (
      <Container>
        <Alert color="primary">
          <h4>Shhh... Here is a secret!</h4>
          <p>
            This Tap requires you to create your own Facebook Ads App. That will
            give you access to the App ID and secret required below. To do so,
            please follow&nbsp;
            <a
              href="https://developers.facebook.com/docs/marketing-apis/"
              onClick={openLink}
            >
              this guide
            </a>.
          </p>
          <p>
            Once your Facebook Ads App is created, add{' '}
            <strong>Facebook Login</strong> and&nbsp;
            <strong>Marketing API</strong> as products to it and specify the
            following option under{' '}
            <code>Facebook Login &gt; Settings &gt; Client OAuth Login</code>:
          </p>
          <ul>
            <li>
              Valid OAuth Redirect URIs:&nbsp;
              <code>https://www.facebook.com/connect/login_success.html</code>
            </li>
          </ul>
          <p>
            You can find your App&apos;s ID and secret under{' '}
            <code>Settings &gt; Basic</code>.<br />
            <strong>IMPORTANT</strong>: If you are not the admin of the Facebook
            Ads App you intend to use, the app owner will need to&nbsp;
            <a
              href="https://developers.facebook.com/docs/marketing-api/access#standard"
              onClick={openLink}
            >
              apply for standard access
            </a>.
          </p>
        </Alert>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <Label for="app_id">App ID</Label>
                <Input
                  type="text"
                  name="app_id"
                  id="app_id"
                  value={app_id}
                  onFocus={() => {
                    this.setState({
                      app_id: Object.assign(this.state.app_id, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('app_id', this.state));
                  }}
                  onChange={this.handleChange}
                  {...this.state.app_id.validation}
                />
                <FormFeedback>{this.state.app_id.errorMessage}</FormFeedback>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="app_secret">App secret</Label>
                <Input
                  type="password"
                  name="app_secret"
                  id="app_secret"
                  value={app_secret}
                  onFocus={() => {
                    this.setState({
                      app_secret: Object.assign(this.state.app_secret, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('app_secret', this.state));
                  }}
                  onChange={this.handleChange}
                  {...this.state.app_secret.validation}
                />
                <FormFeedback>
                  {this.state.app_secret.errorMessage}
                </FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Collapse isOpen={!!(app_id && app_secret)}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="access_token">Access token</Label>
                  <InputGroup>
                    <Input
                      readOnly
                      type="password"
                      name="access_token"
                      value={access_token}
                      id="access_token"
                      onChange={this.handleChange}
                      {...this.state.access_token.validation}
                    />
                    <InputGroupAddon addonType="append">
                      <Button
                        disabled={!(app_id && app_secret)}
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
                <Label for="account_id">Ad account ID</Label>
                <Input
                  type="text"
                  name="account_id"
                  id="account_id"
                  value={account_id}
                  onFocus={() => {
                    this.setState({
                      account_id: Object.assign(this.state.account_id, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('account_id', this.state));
                  }}
                  onChange={this.handleChange}
                  {...this.state.account_id.validation}
                />
                <FormText>
                  Learn how to find your Ad account ID&nbsp;
                  <a
                    href="https://www.facebook.com/business/help/1492627900875762"
                    onClick={openLink}
                  >
                    here
                  </a>
                </FormText>
                <FormFeedback>
                  {this.state.account_id.errorMessage}
                </FormFeedback>
              </FormGroup>
            </Col>
          </Row>
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
