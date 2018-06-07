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
import { Redirect, Link } from 'react-router-dom';
import {
  Container,
  Col,
  Alert,
  Table,
  Button,
  Progress,
  Card,
  CardBody,
  Tooltip
} from 'reactstrap';
import StayScrolled from 'react-stay-scrolled';
import socketIOClient from 'socket.io-client';
import classNames from 'classnames';
import { shell } from 'electron';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import Log from '../Log';

import styles from './Schema.css';

const baseUrl = 'http://localhost:4321';
const socket = socketIOClient(baseUrl);

type Props = {
  tapsStore: {
    schema: Array<Stream>,
    schemaLoading: boolean,
    schemaLoaded: boolean,
    schemaLogs: Array<string>,
    schemaUpdated: boolean,
    selectedTap: { name: string, image: string },
    error?: string
  },
  knotsStore: { knotName: string },
  editSchemaField: (
    field: string,
    index: string,
    value: boolean | string
  ) => void,
  submitSchema: (schema: Array<Stream>, knotName: string) => void,
  submitConfig: (
    selectedTap: { name: string, image: string },
    fieldValues: {},
    knotName: string
  ) => void,
  updateSchemaLogs: (log: string) => void,
  history: { push: (path: string) => void }
};

type State = {
  showSchema: boolean,
  streamSelected: boolean,
  tooltipOpen: boolean
};

type Stream = {
  stream: string,
  tap_stream_id: string,
  metadata: Array<{
    breadcrumb: Array<string>,
    metadata: {
      selected?: boolean
    }
  }>
};

export default class Schema extends Component<Props, State> {
  constructor() {
    super();

    this.state = {
      showSchema: false,
      streamSelected: false,
      tooltipOpen: false
    };

    socket.on('schemaLog', (log) => {
      this.props.updateSchemaLogs(log);
    });
  }

  handleCheckBoxChange = (
    field: string,
    index: string,
    value: boolean | string
  ) => {
    if (!this.validSchema()) {
      this.setState({ streamSelected: this.validSchema() });
    }
    this.props.editSchemaField(field, index, value);
  };

  handleSelectChange = (
    field: string,
    index: string,
    value: boolean | string
  ) => {
    this.props.editSchemaField(field, index, value);
  };

  submit = () => {
    const { knotName } = this.props.knotsStore;
    if (this.validSchema()) {
      this.props.submitSchema(this.props.tapsStore.schema, knotName);
    } else {
      this.setState({ streamSelected: !this.validSchema() });
    }
  };

  validReplicationKeys = (stream: Stream) => {
    let indexToUpdate;
    stream.metadata.forEach((meta, index) => {
      if (meta.breadcrumb.length === 0) {
        indexToUpdate = index;
      }
    });
    if (indexToUpdate !== undefined) {
      return (
        stream.metadata[indexToUpdate].metadata['valid-replication-keys'] || []
      );
    }

    return [];
  };

  fieldSelected = (stream: Stream) => {
    let indexToUpdate;
    stream.metadata.forEach((meta, index) => {
      if (meta.breadcrumb.length === 0) {
        indexToUpdate = index;
      }
    });

    if (indexToUpdate !== undefined) {
      return !!stream.metadata[indexToUpdate].metadata.selected;
    }

    return false;
  };

  showSchema = () => {
    this.setState({ showSchema: true });
  };

  openLink = (repo: string) => {
    shell.openExternal(repo);
  };

  validSchema = () => {
    const { schema } = this.props.tapsStore;

    let valid = false;
    // Valid if a stream has been selected
    schema.forEach((stream) => {
      const { metadata } = stream;

      metadata.forEach((meta) => {
        const subMeta = meta.metadata;

        if (subMeta.selected) {
          valid = true;
        }
      });
    });

    return valid;
  };

  terminateProcess = () => {
    socket.emit('terminate', 'discovery');
  };

  redirectToHome = () => {
    this.terminateProcess();
    this.props.history.push('/');
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };
  retry() {
    const { selectedTap } = this.props.tapsStore;
    const { fieldValues } = this.props.tapsStore[selectedTap.name];
    const { knotName } = this.props.knotsStore;

    this.props.submitConfig(selectedTap, fieldValues, knotName);
  }

  render() {
    if (this.props.tapsStore.schemaUpdated) {
      return <Redirect push to="/targets" />;
    }
    const {
      schemaLoading,
      schemaLoaded,
      schemaLogs,
      error,
      schema
    } = this.props.tapsStore;

    const { showSchema, streamSelected } = this.state;
    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <Col xs="12">
            <h2 className="mb-1 pt-4">Replication Options</h2>

            <div>
              {!showSchema && (
                <div>
                  {schemaLoading && (
                    <Progress value="100" striped animated className="mt-3">
                      Retrieving schema information...
                    </Progress>
                  )}

                  <Card className="bg-light mt-3">
                    <CardBody>
                      <StayScrolled
                        component="div"
                        style={{
                          height: '250px',
                          overflow: 'auto'
                        }}
                      >
                        {schemaLogs.map((log, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Log key={index} log={log} />
                        ))}
                      </StayScrolled>
                    </CardBody>
                  </Card>
                  <Alert
                    isOpen={!!error}
                    color="danger"
                    className={classNames(
                      'd-flex justify-content-between',
                      styles.errorAlert
                    )}
                  >
                    <span className="align-self-center">
                      <span>Unable to execute tap in discovery mode. </span>
                      <button
                        onClick={() => this.openLink('https://help.data.world')}
                        className={classNames('alert-link', styles.link)}
                      >
                        Contact Support
                      </button>
                    </span>
                    <span>
                      <Button
                        className={classNames(
                          'btn btn-outline-secondary',
                          styles.abort
                        )}
                        onClick={() => {
                          this.retry();
                        }}
                      >
                        Retry
                      </Button>

                      <Link to="/taps">
                        <Button className="btn btn-outline-primary">
                          Reconfigure
                        </Button>
                      </Link>
                    </span>
                  </Alert>
                  <Button
                    color="primary"
                    className="float-right my-3"
                    onClick={this.showSchema}
                    disabled={!schemaLoaded || !!error}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={this.redirectToHome}
                    className={classNames(
                      'btn btn-outline-danger float-right my-3',
                      styles.cancel
                    )}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {showSchema &&
                schema.length > 0 && (
                  <div>
                    <p className="mb-4">
                      Select the tables/streams that you would like to
                      replicate. A minimum of 1 is required.
                    </p>
                    <Table className="mt-1">
                      <thead className="thead-light">
                        <tr>
                          <th className="text-center">Include</th>
                          <th>Table/Stream</th>
                          <th id="ReplicationInfo">Replication Key</th>
                          <Tooltip
                            placement="right"
                            isOpen={this.state.tooltipOpen}
                            target="ReplicationInfo"
                            toggle={this.toggleTooltip}
                            className={classNames(styles.repKeyToolTip)}
                          >
                            A sequence column or attribute that can be used to
                            start replication from the last record transferred.
                            Required to enable incremental sync.
                          </Tooltip>
                        </tr>
                      </thead>
                      <tbody>
                        {schema.map((stream, index) => (
                          <tr key={stream.tap_stream_id}>
                            <td className="text-center">
                              <Checkbox
                                checked={this.fieldSelected(stream)}
                                index={index.toString()}
                                handleChange={this.handleCheckBoxChange}
                              />
                            </td>
                            <td>{stream.stream}</td>
                            <td>
                              <Dropdown
                                isDisabled={!this.fieldSelected(stream)}
                                columns={this.validReplicationKeys(stream)}
                                index={index.toString()}
                                handleChange={this.handleSelectChange}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {!!streamSelected && (
                      <Alert color="danger" style={{ opacity: 1 }}>
                        A minimum of one table/stream must be selected
                      </Alert>
                    )}
                    <Button
                      color="primary"
                      className="float-right my-3"
                      onClick={this.submit}
                    >
                      Continue
                    </Button>
                    <Button
                      onClick={this.redirectToHome}
                      className={classNames(
                        'btn btn-outline-danger float-right my-3',
                        styles.cancel
                      )}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
            </div>
          </Col>
        </Container>
      </div>
    );
  }
}
