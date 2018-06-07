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
  Container,
  Alert,
  Col,
  Progress,
  Row,
  Card,
  CardHeader,
  CardBody,
  Button
} from 'reactstrap';
import queryString from 'query-string';
import StayScrolled from 'react-stay-scrolled';

import Header from '../Header';
import Log from '../Log';
import getLogo from '../../logos';

import styles from './SavedSync.css';

type Props = {
  location: { search: string }
};

export default class Sync extends Component<Props> {
  render() {
    const { knot } = queryString.parse(this.props.location.search);
    const tapLogs = ['First log', 'Second log'];
    const targetLogs = ['Another', 'Log'];

    return (
      <div>
        <Header />
        <Container>
          <h2 className="mb-3 pt-4">Knot Name</h2>
          <Alert
            isOpen={true}
            color="danger"
            className="d-flex justify-content-between"
          >
            <span className="align-self-center">Hello I am an error</span>
          </Alert>
          <Progress value="100" striped animated className="mt-3">
            Running partial sync. This may take a while…
          </Progress>
          <Row>
            <Col sm="6">
              <Card className="bg-light mt-3">
                <CardHeader className="d-flex align-items-center">
                  <img
                    alt={` logo`}
                    className={styles.logo}
                    src={getLogo('tap-redshift')}
                  />
                  <h3 className="pl-3 m-0">{'tap-redshift'}</h3>
                </CardHeader>
                <CardBody>
                  <StayScrolled
                    component="div"
                    style={{
                      height: '250px',
                      overflow: 'auto'
                    }}
                  >
                    {tapLogs.map((log) => <Log key={log} log={log} />)}
                  </StayScrolled>
                </CardBody>
              </Card>
            </Col>
            <Col sm="6">
              <Card className="bg-light mt-3">
                <CardHeader className="d-flex align-items-center">
                  <img
                    alt={` logo`}
                    className={styles.logo}
                    src={getLogo('target-stitch')}
                  />
                  <h3 className="pl-3 m-0">{'target-stitch'}</h3>
                </CardHeader>
                <CardBody>
                  <StayScrolled
                    component="div"
                    style={{
                      height: '250px',
                      overflow: 'auto'
                    }}
                  >
                    {targetLogs.map((log) => <Log key={log} log={log} />)}
                  </StayScrolled>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Button className="btn btn-outline-danger float-right my-3">
            Cancel
          </Button>
        </Container>
      </div>
    );
  }
}
