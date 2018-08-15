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
import { Link, withRouter } from 'react-router-dom';
import { Alert, Button, Container, Table } from 'reactstrap';
import type { KnotType } from '../../../utils/sharedTypes';

import Knot from './Knot';

type Props = {
  knotsStore: {
    knots: Array<KnotType>,
    knotDeleted: boolean,
    knotError: string,
    knotLoaded: boolean
  },
  dockerInstalled: boolean,
  dockerRunning: boolean,
  history: { push: (path: string) => void },
  deleteKnot: (knot: string) => void,
  downloadKnot: (knot: string) => void,
  getKnots: () => void,
  loadValues: (knot: string) => void,
  loadKnot: (knot: string) => void,
  generateUUID: () => void,
  toggleDelete: (knot: KnotType) => void,
  toggleDownloadDisclaimer: (knot: KnotType) => void
};

class Knots extends Component<Props> {
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.knotsStore.knotDeleted) {
      this.props.getKnots();
    }
  }

  delete = (knot: { name: string }) => {
    this.props.deleteKnot(knot.name);
  };

  download = (knot: { name: string }) => {
    this.props.downloadKnot(knot.name);
  };

  loadValues = (knot: string) => {
    this.props.loadValues(knot);
  };

  loadKnot = (knot: string) => {
    this.props.loadKnot(knot);
  };

  render() {
    const { knots, knotError, knotLoaded } = this.props.knotsStore;
    const { dockerInstalled, dockerRunning, generateUUID } = this.props;

    if (knotLoaded && !knotError) {
      this.props.history.push('/taps');
    }
    return (
      <Container>
        <p className="h2 mb-3 clearfix">
          Saved knots
          <Link to="/taps">
            <Button
              color="secondary"
              outline
              disabled={!dockerInstalled || !dockerRunning}
              size="sm"
              className="float-right"
              onClick={generateUUID}
            >
              New knot
            </Button>
          </Link>
        </p>
        <Alert
          isOpen={!!knotError}
          color="danger"
          className="d-flex justify-content-between"
        >
          <span className="align-self-center">{knotError}</span>
        </Alert>
        <Table>
          <thead className="thead-light">
            <tr>
              <th className="text-center pr-0" style={{ width: '6em' }}>
                Tap
              </th>
              <th className="px-0 fit" />
              <th className="text-center pl-0" style={{ width: '6em' }}>
                Target
              </th>
              <th>Name</th>
              <th>Last Run</th>
              <th className="fit">Actions</th>
            </tr>
          </thead>
          <tbody>
            {knots.map((knot) => (
              <Knot
                key={knot.name}
                knot={knot}
                delete={this.delete}
                download={this.download}
                loadValues={this.loadValues}
                loadKnot={this.loadKnot}
                dockerInstalled={dockerInstalled}
                dockerRunning={dockerRunning}
                toggleDelete={this.props.toggleDelete}
                toggleDownloadDisclaimer={this.props.toggleDownloadDisclaimer}
                generateUUID={this.props.generateUUID}
              />
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

// $FlowFixMe
export default withRouter(Knots);
