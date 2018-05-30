// @flow
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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
  Progress
} from 'reactstrap';
import StayScrolled from 'react-stay-scrolled';
import classNames from 'classnames';
import socketIOClient from 'socket.io-client';
import queryString from 'query-string';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Log from '../Log';
import getLogo from '../../logos';

import styles from './Sync.css';

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
  updateName: (name: string) => void,
  save: (
    knotName: string,
    selectedTap: { name: string, image: string },
    selectedTarget: { name: string, image: string }
  ) => void,
  updateTapLogs: (log: string) => void,
  updateTargetLogs: (log: string) => void,
  location: { search: string },
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

  handleChange = (event: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget;

    this.props.updateName(value);
  };

  submit = () => {
    const { selectedTap } = this.props.tapStore;
    const { selectedTarget } = this.props.targetsStore;
    const { knotName } = this.props.knotsStore;
    this.props.save(knotName, selectedTap, selectedTarget);
  };

  terminateProcess = () => {
    socket.emit('terminate', 'sync');
  };

  render() {
    const {
      knotSyncing,
      knotSynced,
      knotName,
      tapLogs,
      targetLogs,
      knotError
    } = this.props.knotsStore;
    const { selectedTap } = this.props.tapStore;
    const { selectedTarget } = this.props.targetsStore;
    const { mode } = queryString.parse(this.props.location.search);

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <h2 className="mb-1 pt-4">Save & Run</h2>
          <Alert
            isOpen={!!knotError}
            color="danger"
            className="d-flex justify-content-between"
          >
            <span className="align-self-center">{knotError}</span>
          </Alert>
          <Row>
            {!knotSyncing &&
              !knotSynced &&
              !knotError && (
                <Col xs="12">
                  <Form>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <img
                            alt={`${selectedTap.name} logo`}
                            className={styles.logo}
                            src={getLogo(selectedTap.name)}
                          />
                          <span className="oi oi-chevron-right px-2" />
                          <img
                            alt={`${selectedTarget.name} logo`}
                            className={styles.logo}
                            src={getLogo(selectedTarget.name)}
                          />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Untitled knot"
                        onChange={this.handleChange}
                      />
                    </InputGroup>
                    <Button
                      color="primary"
                      className="float-right mt-2"
                      disabled={!this.props.knotsStore.knotName}
                      onClick={this.submit}
                    >
                      Save & Run
                    </Button>
                  </Form>
                </Col>
              )}
            {knotSyncing && (
              <Col xs="12">
                <Alert color="success" className={styles.syncPageAlert}>
                  <strong className="">{`${knotName} has been saved!`}</strong>
                </Alert>
              </Col>
            )}

            {knotSyncing && (
              <Col xs="12">
                <Progress value="100" striped animated className="mt-3">
                  Running {mode === 'partial' ? 'incremental' : 'full'} sync.
                  This may take a while…
                </Progress>
              </Col>
            )}

            {knotSynced &&
              !knotError && (
                <Col xs="12">
                  <Alert color="success" className={styles.syncPageAlert}>
                    <strong>{`${knotName} has been run successfully`}</strong>
                  </Alert>
                </Col>
              )}
          </Row>
          <Row>
            <Col sm="6">
              <Card className="bg-light mt-3">
                <CardHeader className="d-flex align-items-center">
                  <img
                    alt={`${selectedTarget.name} logo`}
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
                    {tapLogs.map((log) => <Log key={log} log={log} />)}
                  </StayScrolled>
                </CardBody>
              </Card>
            </Col>
            <Col sm="6">
              <Card className="bg-light mt-3">
                <CardHeader className="d-flex align-items-center">
                  <img
                    alt={`${selectedTarget.name} logo`}
                    className={styles.logo}
                    src={getLogo(selectedTarget.name)}
                  />
                  <h3 className={classNames('pl-3 m-0')}>
                    {selectedTarget.name}
                  </h3>
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
          {!knotSynced &&
            !knotError && (
              <Button
                onClick={this.terminateProcess}
                className={classNames(
                  'btn btn-outline-danger float-right my-3'
                )}
                disabled={!knotSyncing}
              >
                Cancel
              </Button>
            )}
          {knotSynced &&
            !knotError && (
              <Link to="/">
                <Button
                  color="primary"
                  className="float-right my-3"
                  disabled={!(knotSynced && !knotError)}
                >
                  Done
                </Button>
              </Link>
            )}
        </Container>
      </div>
    );
  }
}
