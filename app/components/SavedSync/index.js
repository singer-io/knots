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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Container,
  Progress,
  Row
} from 'reactstrap';
import queryString from 'query-string';
import StayScrolled from 'react-stay-scrolled';
import socketIOClient from 'socket.io-client';

import Header from '../Header';
import Log from '../Log';
import getLogo from '../../logos';

import styles from './SavedSync.css';

const baseUrl = 'http://localhost:4321';
const socket = socketIOClient(baseUrl);

type Props = {
  knotsStore: {
    knotName: string,
    knotSyncing: boolean,
    knotSynced: boolean,
    tapLogs: Array<string>,
    targetLogs: Array<string>,
    knotError: string
  },
  tapStore: {
    selectedTap: { name: string, image: string }
  },
  targetsStore: {
    selectedTarget: { name: string, image: string }
  },
  location: { search: string },
  updateTapLogs: (log: string) => void,
  updateTargetLogs: (log: string) => void,
  sync: (knot: string) => void,
  partialSync: (knot: string) => void
};

export default class Sync extends Component<Props> {
  constructor() {
    super();

    socket.on('tapLog', (log) => {
      this.props.updateTapLogs(log);
    });

    socket.on('targetLog', (log) => {
      this.props.updateTargetLogs(log);
    });
  }

  componentWillMount() {
    const { knot, mode } = queryString.parse(this.props.location.search);
    if (mode === 'full') {
      this.props.sync(knot);
    } else if (mode === 'partial') {
      this.props.partialSync(knot);
    }
  }

  terminateProcess = () => {
    socket.emit('terminate', 'sync');
  };

  render() {
    const { knot, mode } = queryString.parse(this.props.location.search);
    const {
      knotSyncing,
      knotSynced,
      tapLogs,
      targetLogs,
      knotError
    } = this.props.knotsStore;
    const { selectedTap } = this.props.tapStore;
    const { selectedTarget } = this.props.targetsStore;

    return (
      <div>
        <Header />
        <Container>
          <h2 className="mb-3">{knot}</h2>
          <Alert
            isOpen={!knotError}
            color="success"
            className="mt-3 d-flex align-items-center"
          >
            <div className="d-flex align-items-center border border-success rounded-circle p-2 mr-4 ml-2">
              <div
                style={{ opacity: '0.5', fontSize: '2rem' }}
                className="oi oi-check my-0"
              />
            </div>
            <div className="w-100">
              <div className="d-flex align-items-center justify-content-between">
                <span>
                  {knotSyncing && <p>{`Runing ${mode} sync`}</p>}
                  {knotSynced && <p>{`${mode} sync has successfully run`}</p>}
                </span>
                <Button
                  size="sm"
                  className="close"
                  title="Cancel sync"
                  style={{ display: knotSynced ? 'none' : '' }}
                >
                  <span className="align-text-top" aria-hidden="true">
                    &times;
                  </span>
                </Button>
              </div>
              {knotSyncing && (
                <Progress
                  color="success"
                  value="100"
                  striped
                  animated
                  className="mt-2 mb-1"
                />
              )}
            </div>
          </Alert>
          <Alert
            isOpen={!!knotError}
            color="danger"
            className="d-flex justify-content-between"
          >
            <span className="align-self-center">{knotError}</span>
            <Link to="/taps">
              <Button color="danger" outline>
                Re-configure
              </Button>
            </Link>
          </Alert>

          <Collapse isOpen={knotSyncing || (knotSynced && knotError)}>
            <Row>
              <Col sm="6">
                <Card className="bg-light mt-3">
                  <CardHeader className="d-flex align-items-center">
                    <img
                      alt={selectedTap.name}
                      className={styles.logo}
                      src={getLogo(selectedTap.name)}
                    />
                    <h3 className="pl-3 m-0">{selectedTap.name}</h3>
                  </CardHeader>
                  <CardBody>
                    <StayScrolled
                      component="div"
                      style={{
                        height: '250px',
                        overflow: 'auto'
                      }}
                    >
                      {tapLogs
                        .slice(-100)
                        .map((log) => <Log key={log} log={log} />)}
                    </StayScrolled>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="6">
                <Card className="bg-light mt-3">
                  <CardHeader className="d-flex align-items-center">
                    <img
                      alt={selectedTarget.name}
                      className={styles.logo}
                      src={getLogo(selectedTarget.name)}
                    />
                    <h3 className="pl-3 m-0">{selectedTarget.name}</h3>
                  </CardHeader>
                  <CardBody>
                    <StayScrolled
                      component="div"
                      style={{
                        height: '250px',
                        overflow: 'auto'
                      }}
                    >
                      {targetLogs
                        .slice(-100)
                        .map((log) => <Log key={log} log={log} />)}
                    </StayScrolled>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Collapse>

          {knotSyncing &&
            !knotError && (
              <Button
                color="danger"
                outline
                onClick={this.terminateProcess}
                className="float-right my-3"
                disabled={!knotSyncing}
              >
                Cancel
              </Button>
            )}
          {knotSynced &&
            !knotError && (
              <Link to="/">
                <Button color="primary" className="float-right my-3">
                  Done
                </Button>
              </Link>
            )}
        </Container>
      </div>
    );
  }
}
