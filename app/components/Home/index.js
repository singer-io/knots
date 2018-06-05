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
import { Container, Alert, Progress } from 'reactstrap';
import { shell } from 'electron';
import classNames from 'classnames';

import Knots from '../../containers/Knots';
import Header from '../Header';
import Create from './Create';

import styles from './Home.css';

type Props = {
  detectDocker: () => void,
  getKnots: () => void,
  knotsStore: {
    detectingDocker: boolean,
    dockerVersionDetected: boolean,
    dockerVersion: string,
    fetchingKnots: boolean,
    knots: Array<{}>
  },
  resetStore: () => void
};

type State = {
  showError: boolean
};

export default class Home extends Component<Props, State> {
  state = {
    showError: false
  };

  componentWillMount() {
    // reset the store
    this.props.resetStore();
    this.props.detectDocker();
    this.props.getKnots();
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ showError: !nextProps.knotsStore.dockerVersion });
  }

  onDismiss = () => {
    this.setState({ showError: false });

    // Alert will disappear then reappear after one second
    // if Docker hasn't been installed
    setTimeout(() => {
      this.props.detectDocker();
    }, 1000);
  };

  dockerDownload = () => {
    shell.openExternal(
      'https://store.docker.com/editions/community/docker-ce-desktop-mac'
    );
  };

  render() {
    const {
      dockerVersionDetected,
      dockerVersion,
      detectingDocker,
      fetchingKnots,
      knots
    } = this.props.knotsStore;

    return (
      <div>
        <Header />
        {detectingDocker &&
          fetchingKnots && (
            <Progress value="100" striped animated className="mt-5" />
          )}

        {!detectingDocker && (
          <Container className="mt-5">
            {dockerVersionDetected && (
              <Alert
                isOpen={this.state.showError}
                color="warning"
                className="d-flex justify-content-between"
              >
                <span className="align-self-center">
                  <span>Docker must be installed before you can proceed. </span>
                  <button
                    onClick={this.dockerDownload}
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
            )}

            {knots.length > 0 && <Knots />}

            {knots.length === 0 && <Create dockerVersion={dockerVersion} />}
          </Container>
        )}
      </div>
    );
  }
}
