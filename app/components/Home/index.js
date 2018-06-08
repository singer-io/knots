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
import { Container, Alert, Progress } from 'reactstrap';
import { shell } from 'electron';
import classNames from 'classnames';

import Knots from '../../containers/Knots';
import Header from '../Header';
import Create from './Create';

import styles from './Home.css';

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
                isOpen={!dockerInstalled}
                color="warning"
                className="d-flex justify-content-between"
              >
                <span className="align-self-center">
                  <span>Docker must be installed before you can proceed. </span>
                  <button
                    onClick={() => {
                      this.openLink(
                        'https://store.docker.com/editions/community/docker-ce-desktop-mac'
                      );
                    }}
                    className={classNames('alert-link', styles.download)}
                  >
                    Download Docker
                  </button>
                </span>
                <span>
                  <button
                    className="btn btn-outline-primary"
                    onClick={this.onDismiss}
                  >
                    Continue
                  </button>
                </span>
              </Alert>
              <Alert
                isOpen={dockerInstalled ? !dockerRunning : false}
                color="warning"
                className="d-flex justify-content-between"
              >
                <span className="align-self-center">
                  <span>Cannot connect to Docker daemon. </span>
                  <button
                    onClick={() =>
                      this.openLink('https://docs.docker.com/config/daemon/')
                    }
                    className={classNames('alert-link', styles.download)}
                  >
                    Is the Docker daemon running?
                  </button>
                </span>
                <span>
                  <button
                    className="btn btn-outline-primary"
                    onClick={this.onDismiss}
                  >
                    Continue
                  </button>
                </span>
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
