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
import { Container, Row, Card, CardHeader, CardBody, Button } from 'reactstrap';
import classNames from 'classnames';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Tap from './Tap';
import TapConfiguration from '../../containers/TapConfiguration';

import styles from './Taps.css';

type Props = {
  fetchTaps: () => void,
  tapsStore: {
    tapSelected: boolean,
    selectedTap: { name: string, image: string },
    tapsLoading: boolean,
    taps: Array<{
      logo: string,
      name: string,
      repo: string,
      tapKey: string,
      tapImage: string
    }>
  },
  knotsStore: { knotName: string },
  history: { push: (path: string) => void },
  selectTap: (tap: { name: string, image: string }) => void,
  submitConfig: (
    selectedTap: { name: string, image: string },
    fieldValues: {},
    knotName: string
  ) => void
};

type State = {
  showTaps: boolean
};

export default class Taps extends Component<Props, State> {
  state = {
    showTaps: true
  };

  componentWillMount() {
    this.props.fetchTaps();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.tapsStore.tapSelected) {
      this.setState({ showTaps: false });
    }
  }

  toggleShowTaps = () => {
    this.setState({ showTaps: !this.state.showTaps });
  };

  formValid = () => {
    const { selectedTap } = this.props.tapsStore;
    if (!selectedTap.name) {
      return false;
    }

    const { fieldValues } = this.props.tapsStore[selectedTap.name];
    let valid = true;

    Object.keys(fieldValues).forEach((field) => {
      if (!fieldValues[field]) {
        valid = false;
      }
    });

    return valid;
  };

  submit = () => {
    const { selectedTap } = this.props.tapsStore;
    const { fieldValues } = this.props.tapsStore[selectedTap.name];
    const { knotName } = this.props.knotsStore;

    this.props.submitConfig(selectedTap, fieldValues, knotName);
    this.props.history.push('/schema');
  };

  redirectToHome = () => {
    this.props.history.push('/');
  };

  render() {
    const { taps, selectedTap } = this.props.tapsStore;
    const { knotName } = this.props.knotsStore;
    const { showTaps } = this.state;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <h2 className="mb-1 pt-4">Configure Tap</h2>
          <p className="mb-4">
            <strong>Taps</strong> extract data from any source and write it to a
            standard stream.
          </p>
          <div id="accordion">
            <Card className="mt-3">
              <CardHeader>
                <Button color="link" onClick={this.toggleShowTaps}>
                  Selection
                </Button>
              </CardHeader>
              <CardBody
                className={classNames('collapse', {
                  show: this.state.showTaps
                })}
              >
                <Row>
                  {taps.map((tap) => (
                    <Tap
                      key={tap.name}
                      {...tap}
                      selectTap={this.props.selectTap}
                      selected={selectedTap.name}
                      knotName={knotName}
                    />
                  ))}
                </Row>
              </CardBody>
            </Card>

            <Card className="mt-3">
              <CardHeader>
                <Button color="link" disabled>
                  Configuration
                </Button>
              </CardHeader>
              <CardBody
                className={classNames('collapse', {
                  show: !showTaps && selectedTap
                })}
              >
                <TapConfiguration />
              </CardBody>
            </Card>
          </div>
          <Button
            color="primary"
            className="float-right my-3"
            onClick={this.submit}
            disabled={!this.formValid() || showTaps}
          >
            Continue
          </Button>
          <Button
            onClick={this.redirectToHome}
            className={classNames(
              'btn btn-outline-danger float-right my-3',
              styles.cancelCta
            )}
          >
            Cancel
          </Button>
        </Container>
      </div>
    );
  }
}
