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
import {
  Button,
  ButtonGroup,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import moment from 'moment';

import getLogo from '../../../../logos';
import styles from './Knot.css';
import type { KnotType } from '../../../../utils/sharedTypes';
import { toISODateString } from '../../../../utils/handlers';

type Props = {
  knot: KnotType,
  dockerInstalled: boolean,
  dockerRunning: boolean,
  tapSeededState: {},
  history: { push: (path: string) => void },
  loadKnot: (name: string) => void,
  loadValues: (name: string, uuid: string, seedingState?: boolean) => void,
  generateUUID: () => void,
  toggleDelete: (knot: KnotType) => void,
  toggleDownloadDisclaimer: (knot: KnotType) => void,
  submitStateDate: (selectedDate, seedStateType) => void,
  seedState: () => void
};

type State = {
  showModal: boolean,
  replication_date: {}
};

class Knot extends Component<Props, State> {
  state = {
    showModal: false,
    replication_date: {}
  };

  fullSync = () => {
    const { knot } = this.props;
    this.props.history.push(`/saved-sync?knot=${knot.name}&mode=full`);
    this.props.loadKnot(knot.name);
  };

  partialSync = () => {
    const { knot } = this.props;
    const { mustSeedState } = knot.tap.specImplementation;

    if (mustSeedState) {
      this.setState({ showModal: true });
      this.props.loadValues(this.props.knot.name, '', true);
    } else {
      this.props.history.push(`/saved-sync?knot=${knot.name}&mode=partial`);
      this.props.loadKnot(knot.name);
    }
  };

  validate = (field: string, value: string) => {
    if (value) {
      this.setState({ [field]: { valid: true } });
    } else {
      this.setState({ [field]: { invalid: true } });
    }
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: { valid: true } });
    const selectedDate = toISODateString(new Date(value));
    const { stateType } =
      this.props.knot.tap.specImplementation.mustSeedState || {};
    this.props.submitStateDate(selectedDate, stateType);
  };

  handleSubmitStateForm = () => {
    const { name } = this.props.knot;
    const { tapSeededState } = this.props;
    this.props.seedState(tapSeededState, name);
    this.props.history.push(`/saved-sync?knot=${name}&mode=partial`);
    this.props.loadKnot(name);
  };

  closeModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  edit = () => {
    this.props.generateUUID();
    const { name } = this.props.knot;
    this.props.history.push({
      pathname: '/taps',
      state: { name }
    });
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
        <Modal isOpen={this.state.showModal}>
          <ModalHeader>Create the initial state file</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="replication_date">
                  Date (for creating initial state file)
                </Label>
                <Input
                  type="date"
                  name="replication_date"
                  id="replication_date"
                  onChange={this.handleChange}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('replication_date', value);
                  }}
                  {...this.state.replication_date}
                />
                <FormFeedback>Required</FormFeedback>
                <FormText>
                  Date for the streams to force the application to only fetch
                  data newer than this date.
                </FormText>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={this.closeModal}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.handleSubmitStateForm}>
              Continue
            </Button>
          </ModalFooter>
        </Modal>
      </tr>
    );
  }
}

// $FlowFixMe
export default withRouter(Knot);
