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

// @flow

import React, { Component } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  FormFeedback
} from 'reactstrap';

import styles from './Redshift.css';

type Props = {
  updateTapField: (tap: string, field: string, value: string) => void
};
type State = {
  host: {},
  port: {},
  dbname: {},
  schema: {},
  user: {},
  password: {},
  start_date: {}
};

export default class Redshift extends Component<Props, State> {
  state = {
    host: {},
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
    const toISODateString = (date) => {
      const pad = (n) => (n < 10 ? `0${n}` : n);

      return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
        date.getUTCDate()
      )}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
        date.getUTCSeconds()
      )}Z`;
    };

    const { name } = e.currentTarget;
    let { value } = e.currentTarget;

    if (name === 'start_date') {
      value = toISODateString(new Date(value));
    }
    this.props.updateTapField('tap-redshift', name, value);
    console.log(name, value);
  };

  render() {
    return (
      <Form className={styles.Redshift}>
        <Row>
          <Col xs="8">
            <FormGroup>
              <Label for="host">Host/IP</Label>
              <Input
                type="text"
                name="host"
                id="host"
                onFocus={() => {
                  this.setState({ host: {} });
                }}
                onBlur={(event) => {
                  const { value } = event.currentTarget;
                  this.validate('host', value);
                }}
                onChange={this.handleChange}
                {...this.state.host}
              />
              <FormFeedback>
                Must be a valid server hostname or IP address
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
                placeholder="PUBLIC"
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
          <Col xs="4">
            <FormGroup>
              <Label for="start_date">Start date</Label>
              <Input
                type="date"
                name="start_date"
                id="start_date"
                onBlur={(event) => {
                  const { value } = event.currentTarget;
                  this.validate('start_date', value);
                }}
                onChange={this.handleChange}
                {...this.state.start_date}
              />
              <FormFeedback>Required</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }
}
