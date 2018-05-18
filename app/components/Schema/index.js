// @flow
import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import {
  Container,
  Alert,
  Table,
  Button,
  Progress,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
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
    error?: string,
    discoveryTerminated: boolean
  },
  editSchemaField: (
    field: string,
    index: string,
    value: boolean | string
  ) => void,
  submitSchema: (schema: Array<Stream>) => void,
  toggle: () => void,
  history: { goBack: () => void },
  updateSchemaLogs: (log: string) => void,
  terminateProcess: () => void
};

type State = {
  showSchema: boolean
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
      showSchema: false
    };

    socket.on('schemaLog', (log) => {
      this.props.updateSchemaLogs(log);
    });
  }

  handleChange = (field: string, index: string, value: boolean | string) => {
    this.props.editSchemaField(field, index, value);
  };

  submit = () => {
    this.props.submitSchema(this.props.tapsStore.schema);
  };

  toggle = () => {
    this.props.toggle();
  };

  reconfigure = () => {
    this.props.history.goBack();
    this.props.toggle();
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

  showSchema = () => {
    this.setState({ showSchema: true });
  };

  terminateProcess = () => {
    this.props.terminateProcess();
  };

  openLink = (repo: string) => {
    shell.openExternal(repo);
  };

  render() {
    if (this.props.tapsStore.schemaUpdated) {
      return <Redirect push to="/targets" />;
    }

    if (this.props.tapsStore.discoveryTerminated) {
      return <Redirect push to="/taps" />;
    }
    const {
      schemaLoading,
      schemaLoaded,
      schemaLogs,
      error
    } = this.props.tapsStore;

    const { showSchema } = this.state;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <h2 className="mb-1 pt-4">Replication Options</h2>

          <div>
            {!showSchema && (
              <div>
                {schemaLoading && (
                  <Progress value="100" striped animated className="mt-5">
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
                <Button
                  color="primary"
                  className="float-right my-3"
                  onClick={this.showSchema}
                  disabled={!schemaLoaded}
                >
                  Continue
                </Button>
                <Button
                  color="secondary"
                  className="float-right my-3"
                  onClick={this.terminateProcess}
                  disabled={schemaLoaded}
                >
                  Cancel
                </Button>
              </div>
            )}
            {showSchema && (
              <div>
                <Table className="mt-5">
                  <thead className="thead-light">
                    <tr>
                      <th className="text-center">Include</th>
                      <th>Table/Stream</th>
                      <th>Replication Key</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.tapsStore.schema.map((stream, index) => (
                      <tr key={stream.tap_stream_id}>
                        <td className="text-center">
                          <Checkbox
                            checked={!!stream.metadata[0].metadata.selected}
                            index={index.toString()}
                            handleChange={this.handleChange}
                          />
                        </td>
                        <td>{stream.stream}</td>
                        <td>
                          <Dropdown
                            columns={this.validReplicationKeys(stream)}
                            index={index.toString()}
                            handleChange={this.handleChange}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Alert color="warning" style={{ opacity: 1 }}>
                  Start date will be ignored unless replication keys are
                  selected
                </Alert>
                <Alert color="danger" style={{ opacity: 1 }}>
                  A minimum of one table/stream must be selected
                </Alert>
                <Button
                  color="primary"
                  className="float-right my-3"
                  onClick={this.submit}
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
          <Modal isOpen={!!error}>
            <ModalHeader className="text-danger">
              <span className="oi oi-warning" /> Tap error
            </ModalHeader>
            <ModalBody>
              Unable to execute tap in discovery mode.
              <pre
                className="bg-light border border-light p-1 rounded"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                Error details:<br />
                {error ? error.toString() : ''}
              </pre>
            </ModalBody>
            <ModalFooter>
              <button
                onClick={() => this.openLink('https://help.data.world')}
                className={classNames('mr-auto text-secondary', styles.link)}
              >
                <small>Contact Support</small>
              </button>
              <Link to="/">
                <Button outline color="secondary">
                  Abort
                </Button>
              </Link>
              <Link to="/taps">
                <Button color="primary">Reconfigure</Button>
              </Link>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    );
  }
}
