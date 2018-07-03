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
  FormFeedback,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
  Progress,
  Collapse
} from 'reactstrap';
import StayScrolled from 'react-stay-scrolled';
import classNames from 'classnames';
import socketIOClient from 'socket.io-client';
import queryString from 'query-string';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Log from '../Log';
import getLogo from '../../logos';
import { tapPropertiesType } from '../../utils/shared-types';

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
    knotError: string,
    knotLoaded: boolean
  },
  tapStore: {
    selectedTap: tapPropertiesType
  },
  targetsStore: {
    selectedTarget: { name: string, image: string }
  },
  updateName: (name: string) => void,
  save: (
    knotName: string,
    selectedTap: tapPropertiesType,
    selectedTarget: { name: string, image: string },
    currentName: string
  ) => void,
  updateTapLogs: (log: string) => void,
  updateTargetLogs: (log: string) => void,
  location: { search: string },
  sync: (knot: string) => void,
  partialSync: (knot: string) => void,
  history: { push: (path: string) => void },
  syncPageLoaded: () => void,
  cancel: () => void
};

type State = {
  currentKnotName: string,
  name: {},
  errorMessage: string,
  knotNameValid: boolean
};

export default class Sync extends Component<Props, State> {
  state = {
    currentKnotName: this.props.knotsStore.knotName,
    name: {},
    errorMessage: '',
    knotNameValid: false
  };

  componentWillMount() {
    const { knot, mode } = queryString.parse(this.props.location.search);
    const { knotName, knotLoaded } = this.props.knotsStore;

    // Receive log messages from socket.io
    socket.on('tapLog', (log) => {
      this.props.updateTapLogs(log);
    });

    socket.on('targetLog', (log) => {
      this.props.updateTargetLogs(log);
    });

    // Check whether the current knotName is valid for when editing knot
    if (knotLoaded) {
      this.validateName(knotName);
    }

    this.props.syncPageLoaded();

    if (mode === 'full') {
      this.props.sync(knot);
    } else if (mode === 'partial') {
      this.props.partialSync(knot);
    }
  }

  handleChange = (event: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget;
    this.props.updateName(value);

    this.validateName(value);
  };

  cancel = () => {
    const { knotName } = this.props.knotsStore;
    this.props.cancel(knotName);
    this.props.history.push('/');
  };

  nameUsed = (enteredName: string) => {
    const { knots, knotName } = this.props.knotsStore;
    const { currentKnotName } = this.state;
    const knotNames = knots.map((knotObject) => knotObject.name);

    // User can overwrite knot being edited
    if (enteredName === currentKnotName) {
      return false;
    }

    if (knotNames.indexOf(enteredName) > -1) {
      return true;
    } else {
      return false;
    }
  };

  validateName = (value: string) => {
    if (value.length <= 60) {
      // Don't allow users to save blank knot names
      if (value.length === 0) {
        this.setState({ name: { invalid: false }, knotNameValid: false });
      } else {
        // Test for special characters /, ?, <, >, \, :, *, |, and "
        const valid = !value.match(/\*|\/|\?|>|<|:|\*|\||"/);

        if (valid) {
          // Ensure unique name has been used
          if (this.nameUsed(value)) {
            this.setState({
              name: { invalid: true },
              errorMessage: 'This name is already in use by a different knot',
              knotNameValid: false
            });
          } else {
            this.setState({ name: { invalid: false }, knotNameValid: true });
          }
        } else {
          this.setState({
            name: { invalid: true },
            errorMessage:
              'Knot name cannot contain the characters /, ?, <, >, :, *, |, and "',
            knotNameValid: false
          });
        }
      }
    } else {
      this.setState({
        name: { invalid: true },
        errorMessage: 'Knot name must be 60 characters or less',
        knotNameValid: false
      });
    }
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
                    <p className="my-0">
                      <strong>{knotName}</strong> has been saved! Running your
                      knot could take a while...<br />
                      <small>
                        You may cancel sync and resume any time. Progress will
                        not be lost!
                      </small>
                    </p>
                  )}
                  {knotSynced && (
                    <p className="my-0">
                      <strong>{knotName}</strong> is done syncing. For now! :-)<br />
                      <small>
                        Come back and run it again any time to sync new data.
                      </small>
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
            <p>
              <strong>Bad news. Your knot failed to run.</strong>
              <br />
              The error message was: &quot;{knotError}&quot;, but make sure to
              review the logs too!
            </p>
            <Link
              to="/taps"
              className="btn btn-outline-danger align-self-center"
            >
              Re-configure
            </Link>
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
                        type="text"
                        placeholder="Untitled knot"
                        value={knotName}
                        onChange={this.handleChange}
                        {...this.state.name}
                      />
                      <FormFeedback>{this.state.errorMessage}</FormFeedback>
                    </InputGroup>
                    <div className="float-right">
                      <Button
                        color="danger"
                        outline
                        className="mt-3 mr-2"
                        onClick={this.cancel}
                      >
                        Cancel
                      </Button>

                      <Button
                        color="primary"
                        className="mt-3"
                        disabled={!this.state.knotNameValid}
                        onClick={this.submit}
                      >
                        Save & Run
                      </Button>
                    </div>
                  </Form>
                </Col>
              )}
          </Row>
          <Collapse isOpen={!!(knotSyncing || (knotSynced && knotError))}>
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
          </Collapse>
          {!knotSynced &&
            knotSyncing && (
              <Button
                color="danger"
                outline
                className="float-right my-3"
                onClick={this.cancel}
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
