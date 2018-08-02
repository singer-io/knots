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
  Row,
  Alert
} from 'reactstrap';
import type {
  TapMySQL,
  UpdateTapField,
  UpdateFormValidation,
  MySQLState
} from '../../../../utils/sharedTypes';
import {
  validateFields,
  formValid,
  showValidation
} from '../../../../utils/handlers';

type Props = {
  tapsStore: {
    'tap-mysql': TapMySQL
  },
  updateTapField: UpdateTapField,
  updateFormValidation: UpdateFormValidation
};

export default class MySQL extends Component<Props, MySQLState> {
  state = {
    host: { validation: {}, errorMessage: 'Required' },
    port: { validation: {}, errorMessage: 'Required' },
    user: { validation: {}, errorMessage: 'Required' },
    password: { validation: {}, errorMessage: 'Required' },
    database: { validation: {}, errorMessage: 'Required' }
  };

  componentWillReceiveProps(nextProps: Props) {
    const { fieldValues } = nextProps.tapsStore['tap-mysql'];
    this.setState(validateFields(fieldValues, this.state));
  }

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    let { value } = e.currentTarget;

    if (name === 'port') {
      value = parseInt(value, 10);
    }

    this.props.updateTapField('tap-mysql', name, value);
  };

  render() {
    const { host, port, user, password, database } = this.props.tapsStore[
      'tap-mysql'
    ].fieldValues;
    const { valid } = this.props.tapsStore['tap-mysql'];
    const validationState = formValid(this.state);

    if (valid !== validationState) {
      this.props.updateFormValidation('tap-mysql', validationState);
    }

    return (
      <Container>
        <Alert color="primary">
          <h4>Note:</h4>
          <p>This Tap currently does not support MySQL version 8.0</p>
        </Alert>
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
                      host: Object.assign(this.state.host, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('host', this.state));
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
                    this.setState({
                      port: Object.assign(this.state.port, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('port', this.state));
                  }}
                  onChange={this.handleChange}
                  {...this.state.port.validation}
                />
                <FormFeedback>{this.state.port.errorMessage}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="user">Database name</Label>
                <Input
                  type="text"
                  name="database"
                  id="database"
                  value={database}
                  onFocus={() => {
                    this.setState({
                      database: Object.assign(this.state.database, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('database', this.state));
                  }}
                  onChange={this.handleChange}
                  {...this.state.database.validation}
                />
                <FormFeedback>{this.state.database.errorMessage}</FormFeedback>
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
                    this.setState({
                      user: Object.assign(this.state.user, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('user', this.state));
                  }}
                  onChange={this.handleChange}
                  {...this.state.user.validation}
                />
                <FormFeedback>{this.state.user.errorMessage}</FormFeedback>
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
                    this.setState({
                      password: Object.assign(this.state.password, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('password', this.state));
                  }}
                  onChange={this.handleChange}
                  {...this.state.password.validation}
                />
                <FormFeedback>{this.state.password.errorMessage}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}
