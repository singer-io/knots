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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
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
  validateFields,
  openLink
} from '../../../../utils/handlers';
import Checkbox from '../Checkbox';

type Props = {
  tapsStore: {
    'tap-postgres': TapPostgres
  },
  updateTapField: UpdateTapField,
  updateFormValidation: UpdateFormValidation,
  updateLogBaseRepMethod: (usesLogBaseRepMethod: boolean) => void
};

export default class Postgres extends Component<Props, PostgresState> {
  state = {
    host: { validation: {}, errorMessage: 'Required' },
    port: { validation: {}, errorMessage: 'Required' },
    dbname: { validation: {}, errorMessage: 'Required' },
    user: { validation: {}, errorMessage: 'Required' },
    password: { validation: {}, errorMessage: 'Required' },
    showModal: false,
    checked: false
  };

  componentWillMount() {
    const { usesLogBaseRepMethod } = this.props.knotsStore;
    this.setState({ checked: usesLogBaseRepMethod }, () => {
      this.props.updateLogBaseRepMethod(this.state.checked);
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { fieldValues } = nextProps.tapsStore['tap-postgres'];
    this.setState(validateFields(fieldValues, this.state));
  }

  handleBlur = (e) => {
    const { name } = e.currentTarget;
    this.setState(showValidation(name, this.state));
  };

  handleFocus = (e) => {
    const { name } = e.currentTarget;
    this.setState({
      [name]: Object.assign(this.state[name], {
        validation: {}
      })
    });
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    let { value } = e.currentTarget;

    if (name === 'port') {
      value = parseInt(value, 10);
    }

    this.props.updateTapField('tap-postgres', name, value);
  };

  toggleModal = (checkBoxState) => {
    this.setState({ showModal: checkBoxState, checked: !this.state.checked });
  };

  onClickRepOption = (usesDefault: ?boolean) => {
    if (!usesDefault) {
      this.props.updateLogBaseRepMethod(!usesDefault);
      this.setState({ showModal: false, checked: true });
    } else {
      this.setState({ showModal: false, checked: false });
    }
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
      <Col>
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
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
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
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
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
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
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
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
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
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    {...this.state.password.validation}
                  />
                  <FormFeedback>
                    {this.state.password.errorMessage}
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <Checkbox
                  checked={this.state.checked}
                  toggleModal={this.toggleModal}
                  updateLogBaseRepMethod={this.props.updateLogBaseRepMethod}
                  currentValue={this.state.currentLogBasedBool || false}
                  knotLoaded={this.props.knotsStore.knotLoaded}
                  deactivateNavigation={this.props.deactivateNavigation}
                  activateNavigation={this.props.activateNavigation}
                />
              </Col>
            </Row>
          </Form>
        </Container>
        <Modal isOpen={this.state.showModal} size="lg">
          <ModalHeader>Use incremental sync?</ModalHeader>
          <ModalBody>
            <p>
              To use incremental replication, please ensure that your PostgreSQL
              user account has the superuser role and has <code>wal_level</code>{' '}
              set to <code>logical</code>.<br />
              <code>max_wal_senders</code> and{' '}
              <code>max_replication_slots</code> should also have values greater
              than <code>0</code>{' '}
              <a
                href="https://www.postgresql.org/docs/10/static/logical-replication-config.html"
                onClick={openLink}
              >
                (learn more).
              </a>
            </p>
            <p>
              Alternatively, you can opt-out of incremental replication and use
              full table replication instead.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="link" onClick={() => this.onClickRepOption(true)}>
              Use full replication
            </Button>
            <Button color="primary" onClick={() => this.onClickRepOption()}>
              Use incremental replication, wal_level is enabled
            </Button>
          </ModalFooter>
        </Modal>
      </Col>
    );
  }
}
