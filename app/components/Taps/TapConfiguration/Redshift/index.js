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
import type {
  tapRedshiftFields,
  tapRedshift,
  fieldState,
  updateTapField,
  updateFormValidation
} from '../../../../utils/sharedTypes';
import {
  toISODateString,
  formatDate,
  formValid,
  showValidation
} from '../../../../utils/handlers';

type Props = {
  tapsStore: {
    'tap-redshift': tapRedshift
  },
  updateTapField: updateTapField,
  updateFormValidation: updateFormValidation
};

type State = {
  host: fieldState,
  port: fieldState,
  dbname: fieldState,
  schema: fieldState,
  user: fieldState,
  password: fieldState,
  start_date: fieldState
};

export default class Redshift extends Component<Props, State> {
  state = {
    host: { validation: {}, errorMessage: 'Required' },
    port: { validation: {}, errorMessage: 'Required' },
    dbname: { validation: {}, errorMessage: 'Required' },
    schema: { validation: { valid: true }, errorMessage: '' },
    user: { validation: {}, errorMessage: 'Required' },
    password: { validation: {}, errorMessage: 'Required' },
    start_date: { validation: {}, errorMessage: 'Required' }
  };

  componentWillReceiveProps(nextProps: Props) {
    const { fieldValues } = nextProps.tapsStore['tap-redshift'];
    this.validateFields(fieldValues);
  }

  validateFields(fieldValues: tapRedshiftFields) {
    const fieldNames = Object.keys(fieldValues);

    fieldNames.forEach((field) => {
      const fieldValue = fieldValues[field];

      if (field === 'host') {
        if (fieldValue) {
          // Ensure a loopback address hasn't been provided
          const loopBackAddresses = /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*:)*?:?0*1$/;
          if (loopBackAddresses.test(fieldValue.toString())) {
            this.setState({
              host: Object.assign(this.state.host, {
                errorMessage: 'KNOTS does not support loopback addresses'
              })
            });
          } else {
            // All checks pass
            this.setState({
              host: Object.assign(this.state.host, {
                errorMessage: ''
              })
            });
          }
        } else {
          // If no value is provided let the user know the field is required
          this.setState({
            host: Object.assign(this.state.host, {
              errorMessage: 'Must be a valid server hostname or IP address'
            })
          });
        }
      } else if (fieldValue) {
        this.setState({
          [field]: Object.assign(this.state[field], {
            errorMessage: ''
          })
        });
      } else {
        this.setState({
          [field]: Object.assign(this.state[field], {
            errorMessage: 'Required'
          })
        });
      }
    });
  }

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
    const { valid } = this.props.tapsStore['tap-redshift'];
    const validationState = formValid(this.state);

    if (valid !== validationState) {
      this.props.updateFormValidation('tap-redshift', validationState);
    }

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
                  {...this.state.schema.validation}
                />
                <FormFeedback>{this.state.schema.errorMessage}</FormFeedback>
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
                  Applies to tables with a defined timestamp field and limits
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
