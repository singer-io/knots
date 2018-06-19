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
import { Alert, Button, Col, Container, Progress, Row } from 'reactstrap';
import { shell } from 'electron';

import Knots from '../../containers/Knots';
import Header from '../Header';
import Create from './Create';

type Props = {
  verifyDocker: () => void,
  getKnots: () => void,
  knotsStore: {
    detectingDocker: boolean,
    dockerVerified: boolean,
    dockerVersion: string,
    dockerRunning: boolean,
    fetchingKnots: boolean,
    knots: Array<{}>
  },
  resetStore: () => void
};

type State = {
  dockerInstalled: boolean,
  dockerRunning: boolean
};

export default class Home extends Component<Props, State> {
  state = {
    dockerInstalled: false,
    dockerRunning: false
  };

  componentWillMount() {
    // reset the store
    this.props.resetStore();
    this.props.verifyDocker();
    this.props.getKnots();
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      dockerInstalled: !!nextProps.knotsStore.dockerVersion,
      dockerRunning: nextProps.knotsStore.dockerRunning
    });
  }

  onDismiss = () => {
    this.setState({ dockerInstalled: true, dockerRunning: true });

    // Alert will disappear then reappear after one second
    // if Docker hasn't been installed
    setTimeout(() => {
      this.props.verifyDocker();
    }, 1000);
  };

  openLink = (url: string) => {
    shell.openExternal(url);
  };

  render() {
    const {
      detectingDocker,
      dockerVerified,
      fetchingKnots,
      knots
    } = this.props.knotsStore;

    const { dockerInstalled, dockerRunning } = this.state;

    return (
      <div>
        <Header />
        {detectingDocker &&
          fetchingKnots && (
            <Progress value="100" striped animated className="mt-5" />
          )}
        <Container className="mt-5">
          {dockerVerified && (
            <div>
              <Alert
                isOpen={!dockerInstalled || !dockerRunning}
                color="warning"
              >
                <Container>
                  <Row>
                    <Col xs="8">
                      <h4 className="alert-heading">
                        Hey, Docker.{' '}
                        {dockerInstalled ? 'Wake up!' : 'Where are you?'}
                      </h4>
                      <p className="mb-0">
                        Please make sure that Docker is{' '}
                        {dockerInstalled ? 'running' : 'installed'}
                        &nbsp;and try again.
                        <br />
                        <small>
                          <em>
                            KNOTS uses&nbsp;
                            <a
                              href="https://www.docker.com/community-edition#/overview"
                              className="alert-link"
                            >
                              Docker
                            </a>
                            &nbsp;to run pipelines reliably on various operating
                            systems.
                          </em>
                        </small>
                      </p>
                    </Col>
                    <Col xs="4">
                      <p className="text-right">
                        {dockerInstalled ? (
                          <Button
                            outline
                            color="danger"
                            onClick={() => {
                              this.openLink(
                                'https://docs.docker.com/docker-for-mac/install/#install-and-run-docker-for-mac'
                              );
                            }}
                            className="mr-2"
                          >
                            Start Docker
                          </Button>
                        ) : (
                          <Button
                            outline
                            color="danger"
                            onClick={() => {
                              this.openLink(
                                'https://store.docker.com/editions/community/docker-ce-desktop-mac'
                              );
                            }}
                            className="mr-2"
                          >
                            Install Docker
                          </Button>
                        )}
                        <Button color="danger" onClick={this.onDismiss}>
                          Retry
                        </Button>
                      </p>
                    </Col>
                  </Row>
                </Container>
              </Alert>
              {knots.length > 0 && (
                <Knots
                  dockerInstalled={dockerInstalled}
                  dockerRunning={dockerRunning}
                />
              )}
              {knots.length === 0 && <Create {...this.state} />}
            </div>
          )}
        </Container>
      </div>
    );
  }
}
