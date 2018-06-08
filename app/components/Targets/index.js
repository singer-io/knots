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
import { Link } from 'react-router-dom';
import { Container, Row, Card, CardHeader, CardBody, Button } from 'reactstrap';
import classNames from 'classnames';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Target from './Target';
import TargetConfiguration from '../../containers/TargetConfiguration';

type Props = {
  getTargets: () => void,
  targetsStore: {
    targetsLoading: boolean,
    targetSelected: boolean,
    targets: Array<{
      name: string,
      repo: string,
      targetKey: string,
      targetImage: string
    }>,
    targetInstalled: boolean,
    selectedTarget: { name: string, image: string }
  },
  userStore: {
    'target-stitch': { fieldValues: {} },
    'target-datadotworld': { fieldValues: {} }
  },
  knotsStore: { knotName: string },
  history: { push: (path: string) => void },
  selectTarget: (target: { name: string, image: string }) => void,
  submitFields: (fielsValues: {}, knotName: string) => void,
  targetsPageLoaded: () => void
};

type State = {
  showTargets: boolean
};

export default class Targets extends Component<Props, State> {
  state = {
    showTargets: true
  };

  componentWillMount() {
    this.props.targetsPageLoaded();
    this.props.getTargets();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.targetsStore.targetSelected) {
      this.setState({ showTargets: false });
    }
  }

  toggleShowTargets = () => {
    this.setState({ showTargets: !this.state.showTargets });
  };

  formValid = () => {
    const { name } = this.props.targetsStore.selectedTarget;

    if (!name) {
      return false;
    }

    // eslint-disable-next-line react/prop-types
    const { fieldValues } = this.props.userStore[name];

    let valid = true;

    Object.keys(fieldValues).forEach((field) => {
      if (!fieldValues[field]) {
        valid = false;
      }
    });

    return valid;
  };

  submit = () => {
    const { name } = this.props.targetsStore.selectedTarget;
    const { fieldValues } = this.props.userStore[name];
    const { knotName } = this.props.knotsStore;

    this.props.submitFields(fieldValues, knotName);

    this.props.history.push('/sync');
  };

  render() {
    const { showTargets } = this.state;
    const { targets, selectedTarget } = this.props.targetsStore;
    const { knotName } = this.props.knotsStore;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <h2 className="mb-1 pt-4">Configure Target</h2>
          <p className="mb-4">
            <strong>Targets</strong> consume data from taps and do something
            with it, like load it into a file, API or database.
          </p>

          <div id="accordion">
            <Card className="mt-3">
              <CardHeader>
                <Button color="link" onClick={this.toggleShowTargets}>
                  Selection
                </Button>
              </CardHeader>
              <CardBody
                className={classNames('collapse', {
                  show: showTargets
                })}
              >
                <Row>
                  {targets.map((target) => (
                    <Target
                      {...target}
                      key={target.targetKey}
                      selectTarget={this.props.selectTarget}
                      selected={selectedTarget.name}
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
                  show: !showTargets && selectedTarget
                })}
              >
                <TargetConfiguration />
              </CardBody>
            </Card>

            <div className="float-right">
              <Link to="/">
                <Button className="btn btn-outline-danger my-3 mr-3">
                  Cancel
                </Button>
              </Link>
              <Button
                color="primary"
                className="float-right my-3"
                disabled={!this.formValid()}
                onClick={this.submit}
              >
                Continue
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}
