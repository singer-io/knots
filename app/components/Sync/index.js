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
    selectedTarget: { name: string, image: string },
    currentName: string
  ) => void,
  updateTapLogs: (log: string) => void,
  updateTargetLogs: (log: string) => void,
  location: { search: string },
  sync: (knot: string) => void,
  partialSync: (knot: string) => void,
  syncPageLoaded: () => void
};

type State = {
  currentKnotName: string
};

export default class Sync extends Component<Props, State> {
  constructor(props: Props) {
    super();

    this.state = { currentKnotName: props.knotsStore.knotName };

    socket.on('tapLog', (log) => {
      this.props.updateTapLogs(log);
    });

    socket.on('targetLog', (log) => {
      this.props.updateTargetLogs(log);
    });
  }

  componentWillMount() {
    this.props.syncPageLoaded();
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

    this.props.save(
      knotName,
      selectedTap,
      selectedTarget,
      this.state.currentKnotName
    );
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

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <h2 className="mb-1 pt-4">Save & Run</h2>

          <Alert
            isOpen={!knotError && (knotSyncing || knotSynced)}
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
                  {knotSyncing && (
                    <p>
                      <strong>{knotName}</strong> has been saved! Running your
                      Knot could take a while...
                    </p>
                  )}
                  {knotSynced && (
                    <p>
                      <strong>{knotName}</strong> has been run successfully
                    </p>
                  )}
                </span>
                <Button
                  size="sm"
                  className="close"
                  title="Cancel sync"
                  style={{ display: knotSynced ? 'none' : '' }}
                  onClick={() => {
                    this.terminateProcess();
                  }}
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
          </Alert>
          <Row>
            {!knotSyncing &&
              !knotSynced &&
              !knotError && (
                <Col xs="12" className="mt-2">
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
                        value={knotName}
                      />
                    </InputGroup>
                    <div className="float-right">
                      <Link to="/">
                        <Button className="btn btn-outline-danger mt-3 mr-3">
                          Cancel
                        </Button>
                      </Link>
                      <Button
                        color="primary"
                        className="mt-3"
                        disabled={!this.props.knotsStore.knotName}
                        onClick={this.submit}
                      >
                        Save & Run
                      </Button>
                    </div>
                  </Form>
                </Col>
              )}
          </Row>
          {(knotSyncing || knotSynced) && (
            <Row>
              <Col sm="6">
                <Card className="bg-light">
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
                <Card className="bg-light">
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
          )}
          {!knotSynced &&
            knotSyncing && (
              <Link to="/">
                <Button className="btn btn-outline-danger float-right my-3">
                  Cancel
                </Button>
              </Link>
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
