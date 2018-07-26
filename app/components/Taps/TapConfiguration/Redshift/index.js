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
  FormText,
  Input,
  Label,
  Row
} from 'reactstrap';
import { toISODateString, formatDate } from '../../../../utils';

type Props = {
  tapsStore: {
    'tap-redshift': {
      fieldValues: {
        host: string,
        dbname: string,
        port?: number,
        schema: string,
        user: string,
        password: string,
        start_date: string
      }
    }
  },
  updateTapField: (tap: string, field: string, value: string | number) => void
};
type State = {
  host: { validation: {}, errorMessage: string },
  port: {},
  dbname: {},
  schema: {},
  user: {},
  password: {},
  start_date: {}
};

export default class Redshift extends Component<Props, State> {
  state = {
    host: { validation: {}, errorMessage: '' },
    port: {},
    dbname: {},
    schema: { valid: true },
    user: {},
    password: {},
    start_date: {}
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
    } else if (name === 'port') {
      value = parseInt(value, 10);
    }

    this.props.updateTapField('tap-redshift', name, value);
  };

  validateHostName = (value: string) => {
    if (value) {
      // Ensure a loopback address hasn't been provided
      const loopBackAddresses = /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*:)*?:?0*1$/;
      if (loopBackAddresses.test(value)) {
        this.setState({
          host: {
            validation: { invalid: true },
            errorMessage: 'KNOTS does not support loopback addresses'
          }
        });
      } else {
        // All checks pass
        this.setState({
          host: {
            validation: { valid: true },
            errorMessage: ''
          }
        });
      }
    } else {
      // If no value is provided let the user know the field is required
      this.setState({
        host: {
          validation: { invalid: true },
          errorMessage: 'Must be a valid server hostname or IP address'
        }
      });
    }
  };

  render() {
    const {
      host,
      dbname,
      port,
      schema,
      user,
      password,
      start_date
    } = this.props.tapsStore['tap-redshift'].fieldValues;

    return (
      <Container>
        <Form>
          <Row>
            <Col xs="8">
              <FormGroup>
                <Label for="host">Host/IP</Label>
                <Input
                  type="text"
                  name="host"
                  id="host"
                  value={host}
                  onFocus={() => {
                    this.setState({
                      host: { validation: {}, errorMessage: '' }
                    });
                  }}
                  onBlur={() => {
                    this.validateHostName(host);
                  }}
                  onChange={this.handleChange}
                  {...this.state.host.validation}
                />
                <FormFeedback>{this.state.host.errorMessage}</FormFeedback>
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
            <Col>
              <FormGroup>
                <Label for="schema">
                  Database schema <small>(optional)</small>
                </Label>
                <Input
                  type="text"
                  name="schema"
                  id="schema"
                  value={schema}
                  onChange={this.handleChange}
                  {...this.state.schema}
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
            <Col>
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
                  Applies to tables with a defined timestamp field and limits
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
