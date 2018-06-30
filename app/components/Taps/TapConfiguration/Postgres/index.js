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
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap';

type Props = {
  tapsStore: {
    'tap-postgres': {
      fieldValues: {
        host: string,
        dbname: string,
        port?: number,
        user: string,
        password: string
      }
    }
  },
  updateTapField: (tap: string, field: string, value: string | number) => void
};
type State = {
  host: {},
  port: {},
  dbname: {},
  user: {},
  password: {}
};

export default class Postgres extends Component<Props, State> {
  state = {
    host: {},
    port: {},
    dbname: {},
    user: {},
    password: {}
  };

  validate = (field: string, value: string) => {
    if (value) {
      this.setState({ [field]: { valid: true } });
    } else {
      this.setState({ [field]: { invalid: true } });
    }
  };

  validateHostName = (value: string) => {
    const unsupportedHost = /^(localhost|127(\.\d{1,3}){3}|::1)$/g;
    if (!value.match(unsupportedHost)) {
      this.setState({ host: { valid: true } });
    } else {
      this.setState({ host: { invalid: true } });
    }
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    let { value } = e.currentTarget;

    if (name === 'port') {
      value = parseInt(value, 10);
    }

    this.props.updateTapField('tap-postgres', name, value);
  };

  render() {
    const { host, dbname, port, user, password } = this.props.tapsStore[
      'tap-postgres'
    ].fieldValues;

    return (
      <Container>
        <Form>
          <Row>
            <Col xs="8">
              <FormGroup>
                <Label for="host">Hostname/IP</Label>
                <Input
                  type="text"
                  name="host"
                  id="host"
                  value={host}
                  onFocus={() => {
                    this.setState({ host: {} });
                  }}
                  onBlur={() => {
                    this.validateHostName(host);
                  }}
                  onChange={this.handleChange}
                  {...this.state.host}
                />
                <FormFeedback>
                  KNOTS does not support loopback addresses
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col xs="4">
              <FormGroup>
                <Label for="port">Port</Label>
                <Input
                  type="number"
                  name="port"
                  id="port"
                  value={port || ''}
                  onFocus={() => {
                    this.setState({ port: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('port', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.port}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="dbname">Database name</Label>
                <Input
                  type="text"
                  name="dbname"
                  id="dbname"
                  value={dbname}
                  onFocus={() => {
                    this.setState({ dbname: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('dbname', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.dbname}
                />
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="user">Username</Label>
                <Input
                  type="text"
                  name="user"
                  id="user"
                  value={user}
                  onFocus={() => {
                    this.setState({ user: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('user', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.user}
                />
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onFocus={() => {
                    this.setState({ password: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('password', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.password}
                />
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}
