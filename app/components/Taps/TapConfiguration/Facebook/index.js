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
import { tapPropertiesType } from '../../../../utils/shared-types';

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
    account_id: {},
    access_token: {},
    app_secret: {},
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

    this.props.updateTapField('tap-facebook', name, value);
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
    const { account_id, app_secret } = this.props.tapsStore[
      'tap-facebook'
    ].fieldValues;
    ipcRenderer.send('fb-authenticate', account_id, app_secret);
  };

  openLink = (e: SyntheticEvent<HTMLButtonElement>, url: string) => {
    e.preventDefault();
    shell.openExternal(url);
  };

  render() {
    const {
      account_id,
      access_token,
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
              href="#"
              onClick={(e) =>
                this.openLink(
                  e,
                  'https://developers.facebook.com/docs/marketing-apis/'
                )
              }
            >
              this guide
            </a>.
          </p>
          <p>
            You must add <strong>Facebook Login</strong> and{' '}
            <strong>Marketing API </strong>
            as products on you Facebook Ads app. On Facebook Login settings,
            select <strong>Client OAuth Login</strong> specifing the following
            option:
          </p>
          <ul>
            <li>
              Valid OAuth Redirect URIs:{' '}
              <code>https://www.facebook.com/connect/login_success.html</code>
            </li>
          </ul>
          <p>
            On Marketing API setting, you need to grant access to Ads insights
            and Ads account by selecting the following options:
            <ul>
              <li>
                App Review for Marketing API:
                <ul>
                  <li>
                    <code>ads_read</code>
                  </li>
                  <li>
                    <code>ads_management</code>
                  </li>
                </ul>
              </li>
            </ul>
            Once you are done, submit for review and wait until the review is
            completed by Facebook.
          </p>
        </Alert>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <Label for="account_id">App ID</Label>
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
          <Collapse isOpen={!!(account_id && app_secret)}>
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
                        disabled={!(account_id && app_secret)}
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
