// @flow
import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Alert,
  FormGroup,
  Label,
  Input,
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
import ErrorModal from '../Modal';
import Log from '../Log';

import styles from './Schema.css';

const baseUrl = 'http://localhost:4321';
const socket = socketIOClient(baseUrl);

type Props = {
  tapsStore: {
    schema: Array<{
      stream: string,
      tap_stream_id: string,
      metadata: Array<{
        metadata: any // eslint-disable-line
      }>
    }>,
    schemaLoading: boolean,
    schemaLoaded: boolean,
    schemaLogs: Array<string>,
    schemaUpdated: boolean,
    dockerConfigError: boolean,
    tapError: boolean,
    invalidSchemaError: boolean,
    error?: string,
    showModal: boolean
  },
  editSchemaField: (field: string, index: string, value: string) => void,
  submitSchema: (
    schema: Array<{
      stream: string,
      tap_stream_id: string,
      metadata: Array<{
        breadcrumb: Array<{}>,
        metadata: {
          selected: string,
          ['valid-replication-keys']: Array<string>
        }
      }>
    }>
  ) => void,
  toggle: () => void,
  history: { goBack: () => void },
  updateSchemaLogs: (log: string) => void
};

type State = {
  showSchema: boolean
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

  handleChange = (field: string, index: string, value: string) => {
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

  validReplicationKeys = (stream: {}) => {
    console.log('The stream', stream);
    let indexToUpdate;
    for (const metadata of stream.metadata) {
      console.log(metadata);
    }
    // let indexToUpdate;
    // console.log('The stream', stream);
    // stream.metadata.forEach((metadata, index) => {
    //   if (metadata.breadcrumb.length === 0) {
    //     indexToUpdate = index;
    //   }
    // });
    // if (indexToUpdate) {
    //   return (
    //     stream.metadata[indexToUpdate].metadata['valid-replication-keys'] || []
    //   );
    // }

    // return [];
  };

  showSchema = () => {
    this.setState({ showSchema: true });
  };

  openLink = (repo: string) => {
    shell.openExternal(repo);
  };

  render() {
    if (this.props.tapsStore.schemaUpdated) {
      return <Redirect push to="/targets" />;
    }
    const {
      schemaLoading,
      schemaLoaded,
      schemaLogs,
      dockerConfigError,
      showModal,
      tapError,
      error,
      invalidSchemaError
    } = this.props.tapsStore;

    const { showSchema } = this.state;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />

          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              {!showSchema && (
                <div>
                  {schemaLoading && (
                    <Progress value="100" striped animated className="mt-5">
                      Retrieving schema information...
                    </Progress>
                  )}

                  {dockerConfigError && (
                    <ErrorModal
                      showModal={showModal}
                      headerText="Docker configuration error"
                      body={
                        <p>
                          Please check Docker{' '}
                          <a href="https://docs.docker.com/docker-for-mac/osxfs/#namespaces">
                            file sharing preferences
                          </a>{' '}
                          and make sure that <code color="red">/User</code> is a
                          shared directory.
                        </p>
                      }
                      error=""
                      toggle={this.toggle}
                      reconfigure={this.reconfigure}
                      buttonText="Retry"
                    />
                  )}
                  {tapError && (
                    <ErrorModal
                      showModal={showModal}
                      headerText="Tap error"
                      body={<p>Unable to execute tap in discovery mode.</p>}
                      error={error}
                      reconfigure={this.reconfigure}
                      buttonText="Reconfigure"
                      toggle={this.toggle}
                    />
                  )}
                  {invalidSchemaError && (
                    <ErrorModal
                      showModal={showModal}
                      headerText="Invalid schema"
                      body={<p>Tap generated an invalid schema.</p>}
                      error={error}
                      reconfigure={this.reconfigure}
                      buttonText="Reconfigure"
                      toggle={this.toggle}
                    />
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
                        {schemaLogs.map((log) => <Log key={log} log={log} />)}
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
                </div>
              )}
              {showSchema && (
                <div>
                  <FormGroup className="form-row form-group form-inline mt-5">
                    <Label for="startDate" className="col-form-label">
                      Start replication from:
                    </Label>
                    <Input
                      type="date"
                      name="date"
                      id="exampleDate"
                      placeholder="date placeholder"
                    />
                  </FormGroup>
                  <Table>
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
                              columns={['ab', 'cd']}
                              index={index.toString()}
                              handleChange={this.handleChange}
                            />
                            {this.validReplicationKeys(stream)}
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
            </Col>
          </Row>
          <Modal isOpen={!!error}>
            <ModalHeader className="text-danger">
              <span className="oi oi-warning" /> Tap error
            </ModalHeader>
            <ModalBody>
              Unable to execute tap in discovery mode.
              {console.log('This is the error', error)}
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
