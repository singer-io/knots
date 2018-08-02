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
import type {
  PostgresState,
  TapPostgres,
  UpdateTapField,
  UpdateFormValidation
} from '../../../../utils/sharedTypes';
import {
  formValid,
  showValidation,
  validateFields
} from '../../../../utils/handlers';

type Props = {
  tapsStore: {
    'tap-postgres': TapPostgres
  },
  updateTapField: UpdateTapField,
  updateFormValidation: UpdateFormValidation
};

export default class Postgres extends Component<Props, PostgresState> {
  state = {
    host: { validation: {}, errorMessage: 'Required' },
    port: { validation: {}, errorMessage: 'Required' },
    dbname: { validation: {}, errorMessage: 'Required' },
    user: { validation: {}, errorMessage: 'Required' },
    password: { validation: {}, errorMessage: 'Required' }
  };

  componentWillReceiveProps(nextProps: Props) {
    const { fieldValues } = nextProps.tapsStore['tap-postgres'];
    this.setState(validateFields(fieldValues, this.state));
  }

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
    const { valid } = this.props.tapsStore['tap-postgres'];
    const validationState = formValid(this.state);

    if (valid !== validationState) {
      this.props.updateFormValidation('tap-postgres', validationState);
    }

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
                <Label for="dbname">Database name</Label>
                <Input
                  type="text"
                  name="dbname"
                  id="dbname"
                  value={dbname}
                  onFocus={() => {
                    this.setState({
                      dbname: Object.assign(this.state.dbname, {
                        validation: {}
                      })
                    });
                  }}
                  onBlur={() => {
                    this.setState(showValidation('dbname', this.state));
                  }}
                  onChange={this.handleChange}
                  {...this.state.dbname.validation}
                />
                <FormFeedback>{this.state.dbname.errorMessage}</FormFeedback>
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
            <Col xs="6">
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
