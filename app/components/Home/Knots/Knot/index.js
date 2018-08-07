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
import { withRouter } from 'react-router-dom';
import { Button, ButtonGroup } from 'reactstrap';
import moment from 'moment';

import getLogo from '../../../../logos';
import styles from './Knot.css';
import type { KnotType } from '../../../../utils/sharedTypes';

type Props = {
  knot: KnotType,
  dockerInstalled: boolean,
  dockerRunning: boolean,
  history: { push: (path: string) => void },
  loadValues: (name: string) => void,
  toggleDelete: (knot: KnotType) => void,
  toggleDownloadDisclaimer: (knot: KnotType) => void
};

class Knot extends Component<Props> {
  fullSync = () => {
    const { knot } = this.props;
    this.props.history.push(`/saved-sync?knot=${knot.name}&mode=full`);
    this.props.loadValues(knot.name);
  };

  partialSync = () => {
    const { knot } = this.props;
    this.props.history.push(`/saved-sync?knot=${knot.name}&mode=partial`);
    this.props.loadValues(knot.name);
  };

  edit = () => {
    const { name } = this.props.knot;
    this.props.history.push('/taps');
    this.props.loadValues(name);
  };

  render() {
    const { knot, dockerInstalled, dockerRunning } = this.props;
    const { specImplementation } = knot.tap;
    const { usesReplication: usesReplication = true } =
      specImplementation || {};
    return (
      <tr key={knot.name}>
        <td className="align-middle text-center pr-0">
          <img
            alt={`${knot.tap.name} logo`}
            className={styles.logo}
            src={getLogo(knot.tap.name)}
          />
        </td>
        <td className="align-middle px-0 text-muted text-center">
          <span className="oi oi-chevron-right" />
        </td>
        <td className="align-middle text-center pr-0">
          <img
            alt={`${knot.target.name} logo`}
            className={styles.logo}
            src={getLogo(knot.target.name)}
          />
        </td>
        <th className="align-middle">{knot.name}</th>
        <td className="align-middle">{moment(knot.lastRun).fromNow()}</td>
        <td className="fit align-middle">
          <ButtonGroup>
            <Button
              color="link"
              style={{ background: 'white' }}
              className="btn btn-link"
              data-toggle="tooltip"
              data-placement="top"
              title="Sync new data"
              onClick={this.partialSync}
              disabled={!dockerInstalled || !dockerRunning || !usesReplication}
            >
              <span className="oi oi-media-play" />
            </Button>

            <Button
              color="link-secondary"
              style={{ background: 'white' }}
              className="btn btn-link-secondary"
              data-toggle="tooltip"
              data-placement="top"
              title="Sync all data"
              onClick={this.fullSync}
              disabled={!dockerInstalled || !dockerRunning}
            >
              <span className="oi oi-reload" />
            </Button>
            <Button
              color="link-secondary"
              style={{ background: 'white' }}
              title="Edit"
              onClick={this.edit}
              disabled={!dockerInstalled || !dockerRunning}
            >
              <span className="oi oi-pencil" />
            </Button>
            <Button
              color="link-secondary"
              style={{ background: 'white' }}
              onClick={() => {
                this.props.toggleDownloadDisclaimer(knot);
              }}
              title="Export"
            >
              <span className="oi oi-cloud-download" />
            </Button>
            <Button
              color="link-secondary"
              style={{ background: 'white' }}
              onClick={() => {
                this.props.toggleDelete(knot);
              }}
              title="Delete"
            >
              <span className="oi oi-trash" />
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    );
  }
}

// $FlowFixMe
export default withRouter(Knot);
