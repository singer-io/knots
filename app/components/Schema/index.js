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
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Progress,
  Table,
  Tooltip
} from 'reactstrap';
import StayScrolled from 'react-stay-scrolled';
import socketIOClient from 'socket.io-client';
import { shell } from 'electron';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import Log from '../Log';

const baseUrl = 'http://localhost:4321';
const socket = socketIOClient(baseUrl);

type Props = {
  tapsStore: {
    schema: Array<Stream>,
    schemaLoading: boolean,
    schemaLoaded: boolean,
    schemaLogs: Array<string>,
    schemaUpdated: boolean,
    selectedTap: { name: string, image: string, isLegacy: boolean },
    error?: string
  },
  knotsStore: { knotName: string, knotName: string },
  editSchemaField: (
    field: string,
    index: string,
    value: boolean | string,
    isLegacy: boolean
  ) => void,
  submitSchema: (schema: Array<Stream>, knotName: string) => void,
  submitConfig: (
    selectedTap: { name: string, image: string },
    fieldValues: {},
    knotName: string
  ) => void,
  schemaPageLoaded: () => void,
  updateSchemaLogs: (log: string) => void,
  history: { push: (path: string) => void },
  cancel: () => void
};

type State = {
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
      streamSelected: false,
      tooltipOpen: false
    };
  }

  componentWillMount() {
    this.props.schemaPageLoaded();
    socket.on('schemaLog', (log) => {
      this.props.updateSchemaLogs(log);
    });
  }

  updateLogs(log: text) {
    this.props.updateSchemaLogs(log);
  }

  handleCheckBoxChange = (
    field: string,
    index: string,
    value: boolean | string
  ) => {
    const { isLegacy } = this.props.tapsStore.selectedTap;
    if (!this.validSchema()) {
      this.setState({ streamSelected: this.validSchema() });
    }
    this.props.editSchemaField(field, index, value, isLegacy);
  };

  handleSelectChange = (
    field: string,
    index: string,
    value: boolean | string
  ) => {
    const { isLegacy } = this.props.tapsStore.selectedTap;
    this.props.editSchemaField(field, index, value, isLegacy);
  };

  submit = () => {
    // TODO Ask for confirmation if no timestamp fields are selected when they are available
    const { knotName } = this.props.knotsStore;
    if (this.validSchema()) {
      this.props.submitSchema(this.props.tapsStore.schema, knotName);
      this.props.history.push('/targets');
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

  openLink = (e: SyntheticEvent, url: string) => {
    e.preventDefault();
    shell.openExternal(url);
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

  cancel = (discovery: boolean) => {
    const { knotName } = this.props.knotsStore;

    if (discovery) {
      this.terminateProcess();
    }

    this.terminateProcess();
    this.props.cancel(knotName);
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
    const {
      selectedTap,
      schemaLoading,
      schemaLoaded,
      schemaLogs,
      error,
      schema
    } = this.props.tapsStore;

    const { streamSelected } = this.state;
    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <Col xs="12">
            <h2 className="mb-1 pt-4">Replication options</h2>
            <div>
              {(!schemaLoaded || !!error) && (
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
                        {schemaLogs.slice(-100).map((log, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Log key={index} log={log} />
                        ))}
                      </StayScrolled>
                    </CardBody>
                  </Card>
                  <Alert
                    isOpen={!!error}
                    color="danger"
                    className="d-flex justify-content-between mt-1"
                  >
                    <p className="align-self-center mb-0">
                      <strong>Well, that didn&apos;t work!</strong>&nbsp; Review
                      logs for additional information.<br />
                      <small>
                        If you need help,&nbsp;
                        <button
                          className="alert-link border-0"
                          style={{ background: 'none', cursor: 'pointer' }}
                          onClick={(e) => this.openLink(e, selectedTap.repo)}
                        >
                          report your issue to the{' '}
                          <code>{selectedTap.name}</code> team.
                        </button>
                      </small>
                    </p>
                    <div className="align-self-center">
                      <Button
                        outline
                        color="danger"
                        className="mr-2"
                        onClick={() => {
                          this.retry();
                        }}
                      >
                        Retry
                      </Button>
                      <Link to="/taps">
                        <Button color="danger">Reconfigure</Button>
                      </Link>
                    </div>
                  </Alert>
                  <Button
                    color="danger"
                    outline
                    onClick={() => {
                      this.cancel(true);
                    }}
                    className="float-right my-3"
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {schemaLoaded &&
                !error &&
                schema.length === 0 && (
                  <div>
                    <Alert color="danger" className="my-3">
                      Looks like you’ve got a dry Tap! Make sure your data
                      source contains at least one table or stream.
                    </Alert>
                    <Button
                      color="danger"
                      outline
                      onClick={() => {
                        this.cancel(false);
                      }}
                      className="float-right"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              {schemaLoaded &&
                schema.length > 0 && (
                  <div>
                    <p className="mb-4">
                      Select the tables/streams that you would like to
                      replicate. A minimum of 1 is required.
                    </p>
                    <Table striped className="mt-1">
                      <thead className="thead-light">
                        <tr>
                          <th className="text-center" style={{ width: '7em' }}>
                            Include
                          </th>
                          <th>Table/Stream</th>
                          <th>
                            Timestamp field
                            <i
                              id="ReplicationInfo"
                              className="fa fa-question-circle-o ml-1"
                            />
                          </th>
                          <Tooltip
                            placement="right"
                            isOpen={this.state.tooltipOpen}
                            target="ReplicationInfo"
                            toggle={this.toggleTooltip}
                          >
                            A date/time column or attribute that can be used to
                            limit historical data replication and to enable
                            incremental replication.
                          </Tooltip>
                        </tr>
                      </thead>
                      <tbody>
                        {schema.map((stream, index) => (
                          <tr key={stream.tap_stream_id}>
                            <td className="text-center align-middle">
                              <Checkbox
                                checked={this.fieldSelected(stream)}
                                index={index.toString()}
                                handleChange={this.handleCheckBoxChange}
                              />
                            </td>
                            <td className="align-middle">{stream.stream}</td>
                            <td>
                              <Dropdown
                                columns={this.validReplicationKeys(stream)}
                                index={index.toString()}
                                handleChange={this.handleSelectChange}
                                stream={stream}
                                isLegacy={selectedTap.isLegacy}
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
                      color="danger"
                      outline
                      onClick={() => {
                        this.cancel(false);
                      }}
                      className="float-right my-3 mr-2"
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
