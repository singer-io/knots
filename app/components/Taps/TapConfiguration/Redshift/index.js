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
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';

import styles from './Redshift.css';

type Props = {};

export default class Target extends Component<Props> {
  render() {
    return (
      <Form className={styles.Redshift}>
        <Row>
          <Col xs="8">
            <FormGroup>
              <Label for="host">Host/IP</Label>
              <Input type="text" name="host" id="host" />
            </FormGroup>
          </Col>
          <Col xs="4">
            <FormGroup>
              <Label for="port">Port</Label>
              <Input type="number" name="port" id="port" />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="database">Database name</Label>
              <Input type="text" name="database" id="database" />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="schema">
                Database schmema <small>(optional)</small>
              </Label>
              <Input type="text" name="schema" id="schema" />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input type="text" name="username" id="username" />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="text" name="password" id="password" />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="4">
            <FormGroup>
              <Label for="start-date">Start date</Label>
              <Input type="date" name="start-date" id="start-date" />
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }
}
