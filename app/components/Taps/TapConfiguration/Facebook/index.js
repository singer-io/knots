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
import type { tapPropertiesType } from '../../../../utils/sharedTypes';
import { openLink } from '../../../../utils/handlers';

type Props = {
  tapsStore: {
    selectedTap: tapPropertiesType,
    'tap-facebook': {
      fieldValues: {
        account_id: string,
        access_token: string,
        app_secret: string,
        start_date: string
      }
    }
  },
  updateTapField: (tap: string, field: string, value: string) => void
};

type State = {
  account_id: {},
  access_token: {},
  app_secret: {},
  start_date: {}
};

export default class Facebook extends Component<Props, State> {
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
    access_token: '',
    account_id: '',
    app_id: '',
    app_secret: '',
    start_date: ''
  };

  validate = (field: string, value: string) => {
    if (value) {
      this.setState({ [field]: { valid: true } });
    } else {
      this.setState({ [field]: { invalid: true } });
    }
  };

  // TODO DRY
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

    this.props.updateTapField('tap-facebook', name, value);
  };

  // TODO DRY
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
                    this.setState({ app_id: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('app_id', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.app_id}
                />
                <FormFeedback>Required</FormFeedback>
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
                    this.setState({ app_secret: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('app_secret', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.app_secret}
                />
                <FormFeedback>Required</FormFeedback>
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
                      {...this.state.access_token}
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
                    this.setState({ account_id: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('account_id', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.account_id}
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
                <FormFeedback>Required</FormFeedback>
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
