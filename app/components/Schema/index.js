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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Checkbox from './Checkbox';
import KeyFields from './KeyFields';
import ReplicationKeys from './ReplicationKeys';
import Dropdown from './Dropdown';
import Log from '../Log';
import { getMetadata, getColumns, getReplicationKey } from '../../utils/schema';
import type {
  specImplementationPropType,
  tapPropertiesType
} from '../../utils/sharedTypes';

const baseUrl = 'http://localhost:4321';
const socket = socketIOClient(baseUrl);

type Props = {
  tapsStore: {
    schema: Array<Stream>,
    schemaLoading: boolean,
    schemaLoaded: boolean,
    schemaLogs: Array<string>,
    schemaUpdated: boolean,
    selectedTap: tapPropertiesType,
    error?: string
  },
  knotsStore: { knotName: string, uuid: string },
  editSchemaField: (
    field: string,
    index: string,
    value: boolean | string,
    specImplementation: specImplementationPropType
  ) => void,

  modifySchema: (index: number, field: string, value: Array) => void,
  submitSchema: (schema: Array<Stream>, uuid: string) => void,
  submitConfig: (
    selectedTap: { name: string, image: string },
    fieldValues: {},
    knotName: string
  ) => void,
  schemaPageLoaded: () => void,
  updateSchemaLogs: (log: string) => void,
  history: { push: (path: string) => void },
  cancel: (name: string) => void
};

type State = {
  streamSelected: boolean,
  tooltipOpen: boolean
};

type Stream = {
  stream: string,
  tap_stream_id: string,
  metadata?: Array<{
    breadcrumb: Array<string>,
    metadata: {
      selected?: boolean
    }
  }>
};

const metadataIndexToUpdate = (stream) => {
  let indexToUpdate;
  if (stream && stream.metadata) {
    stream.metadata.forEach((meta, index) => {
      if (meta.breadcrumb.length === 0) {
        indexToUpdate = index;
      }
    });
  }
  return indexToUpdate;
};

export default class Schema extends Component<Props, State> {
  constructor() {
    super();

    this.state = {
      streamSelected: false,
      replicationToolTipOpen: false,
      keyFieldsToolTipOpen: false
    };
  }

  componentWillMount() {
    this.props.schemaPageLoaded();
    socket.on('schemaLog', (log) => {
      this.props.updateSchemaLogs(log);
    });
  }

  updateLogs(log: string) {
    this.props.updateSchemaLogs(log);
  }

  handleCheckBoxChange = (
    field: string,
    index: string,
    value: boolean | string
  ) => {
    const { specImplementation } = this.props.tapsStore.selectedTap;
    if (!this.validSchema()) {
      this.setState({ streamSelected: this.validSchema() });
    }
    this.props.editSchemaField(field, index, value, specImplementation);
  };

  handleSelectChange = (
    field: string,
    index: string,
    value: boolean | string
  ) => {
    const { specImplementation } = this.props.tapsStore.selectedTap;
    this.props.editSchemaField(field, index, value, specImplementation);
  };

  submit = () => {
    // TODO Ask for confirmation if no timestamp fields are selected when they are available
    const { uuid } = this.props.knotsStore;
    if (this.validSchema()) {
      this.props.submitSchema(this.props.tapsStore.schema, uuid);
      this.props.history.push('/targets');
    } else {
      this.setState({ streamSelected: !this.validSchema() });
    }
  };

  validReplicationKeys = (stream: Stream) => {
    const indexToUpdate = metadataIndexToUpdate(stream);
    if (indexToUpdate !== undefined) {
      return (
        stream.metadata[indexToUpdate].metadata['valid-replication-keys'] || []
      );
    }

    return [];
  };

  fieldSelected = (stream: Stream) => {
    const specImplementation =
      this.props.tapsStore.selectedTap.specImplementation || {};

    const { selected: usesSelected = true } =
      specImplementation.usesMetadata || {};

    if (!usesSelected) {
      return !!stream.schema.selected;
    }

    const indexToUpdate = metadataIndexToUpdate(stream);

    if (indexToUpdate !== undefined) {
      return !!stream.metadata[indexToUpdate].metadata.selected;
    }

    return false;
  };

  openLink = (e: SyntheticEvent<HTMLButtonElement>, url: string) => {
    e.preventDefault();
    shell.openExternal(url);
  };

  validSchema = () => {
    const { schema } = this.props.tapsStore;

    const specImplementation =
      this.props.tapsStore.selectedTap.specImplementation || {};

    const { selected: usesSelected = true } =
      specImplementation.usesMetadata || {};

    // true if a stream has been selected
    let valid = false;

    if (!usesSelected) {
      schema.forEach((stream) => {
        if (stream.schema) {
          valid = true;
        }
      });
    } else {
      schema.forEach((stream) => {
        const { metadata } = stream;

        metadata.forEach((meta) => {
          if (meta.breadcrumb.length === 0 && meta.metadata.selected) {
            valid = true;
          }
        });
      });
    }

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

  toggleTooltip = (field) => {
    this.setState({
      [field]: !this.state[field]
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
                    className="d-flex justify-content-between mt-3"
                  >
                    <p className="align-self-center mb-0">
                      <strong>Well, that didn&apos;t work!</strong>
                      &nbsp; Review logs for additional information.
                      <br />
                      <small>
                        If you need help,&nbsp;
                        {/* eslint-disable */}
                        <a
                          className="alert-link border-0"
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => this.openLink(e, selectedTap.repo)}
                        >
                          report your issue to the{' '}
                          <code>{selectedTap.name}</code> team.
                        </a>
                        {/* eslint-disable */}
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
                      <Link to="/taps" className="btn btn-danger">
                        Reconfigure
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
                    <Alert
                      color="danger"
                      className="d-flex justify-content-between align-items-center my-3"
                    >
                      <p className="my-0">
                        <strong>Looks like you’ve got a dry Tap!</strong> Make
                        sure your data source contains at least one table or
                        stream.
                      </p>
                      <Button
                        color="danger"
                        outline
                        onClick={() => {
                          this.cancel(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Alert>
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
                            Key field(s){' '}
                            <FontAwesomeIcon
                              id="KeyFieldsInfo"
                              icon={faQuestionCircle}
                            />
                          </th>
                          <th>
                            Timestamp field{' '}
                            <FontAwesomeIcon
                              id="ReplicationInfo"
                              icon={faQuestionCircle}
                            />
                          </th>
                          <Tooltip
                            placement="right"
                            isOpen={this.state.replicationToolTipOpen}
                            target="ReplicationInfo"
                            toggle={() =>
                              this.toggleTooltip('replicationToolTipOpen')
                            }
                          >
                            A date/time column or attribute that can be used to
                            limit historical data replication and to enable
                            incremental replication.
                          </Tooltip>
                          <Tooltip
                            placement="right"
                            isOpen={this.state.keyFieldsToolTipOpen}
                            target="KeyFieldsInfo"
                            toggle={() =>
                              this.toggleTooltip('keyFieldsToolTipOpen')
                            }
                          >
                            One or more fields that uniquely identify each
                            record. Key field(s) are used to detect and handle
                            duplicates.
                          </Tooltip>
                        </tr>
                      </thead>
                      <tbody>
                        {schema.map((stream, index) => {
                          const metadata = getMetadata(stream);
                          const replicationKeys =
                            metadata.metadata['valid-replication-keys'] || [];

                          const isView = metadata.metadata['is-view'];
                          const keyProperties =
                            metadata.metadata[
                              isView
                                ? 'view-key-properties'
                                : 'table-key-properties'
                            ] || [];

                          return (
                            <tr key={stream.tap_stream_id}>
                              <td className="text-center align-middle">
                                <Checkbox
                                  checked={this.fieldSelected(stream)}
                                  index={index.toString()}
                                  handleChange={this.handleCheckBoxChange}
                                />
                              </td>
                              <td className="align-middle">{stream.stream}</td>
                              <td style={{ width: '35%' }}>
                                <KeyFields
                                  modifySchema={this.props.modifySchema}
                                  index={index}
                                  streamMetadata={metadata}
                                  columns={getColumns(stream)}
                                />
                                <Dropdown
                                  isMulti
                                  values={getColumns(stream)}
                                  defaultValues={keyProperties}
                                  handleChange={this.props.modifySchema}
                                  field="keyFields"
                                  streamMetadata={metadata}
                                  index={index}
                                />
                              </td>
                              <td className="align-middle">
                                <ReplicationKeys
                                  index={index.toString()}
                                  replicationKeys={replicationKeys}
                                  defaultValue={getReplicationKey(
                                    stream,
                                    metadata.metadata,
                                    selectedTap.specImplementation
                                  )}
                                  handleChange={this.handleSelectChange}
                                />
                                <Dropdown
                                  values={['a', 'b', 'c'] || replicationKeys}
                                  defaultValues={[
                                    'ab'
                                    // getReplicationKey(
                                    //   stream,
                                    //   metadata.metadata,
                                    //   selectedTap.specImplementation
                                    // )
                                  ]}
                                  isMulti={false}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    {!!streamSelected && (
                      <Alert color="danger" style={{ opacity: 1 }}>
                        A minimum of one table/stream must be selected
                      </Alert>
                    )}
                    <div className="my-3 d-flex justify-content-end">
                      <Button
                        color="danger"
                        outline
                        className="mr-2"
                        onClick={() => {
                          this.cancel(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button color="primary" onClick={this.submit}>
                        Continue
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </Col>
        </Container>
      </div>
    );
  }
}
