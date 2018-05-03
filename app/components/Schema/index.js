// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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
  Progress
} from 'reactstrap';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import ErrorModal from '../Modal';

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
    schemaUpdated: boolean,
    dockerConfigError: boolean,
    error: string,
    showModal: boolean
  },
  editSchemaField: (field: string, index: string, value: string) => void,
  submitSchema: (
    schema: Array<{
      stream: string,
      tap_stream_id: string,
      metadata: Array<{
        metadata: {
          selected: string,
          ['valid-replication-keys']: Array<string>
        }
      }>
    }>
  ) => void,
  toggle: () => void,
  history: object
};

export default class Schema extends Component<Props> {
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
  };

  render() {
    if (this.props.tapsStore.schemaUpdated) {
      return <Redirect push to="/targets" />;
    }
    const { dockerConfigError, showModal } = this.props.tapsStore;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />

          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              {this.props.tapsStore.schemaLoading && (
                <div>
                  <Progress value="100" striped animated className="mt-5">
                    Retrieving schema information...
                  </Progress>
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
                </div>
              )}
              {!this.props.tapsStore.schemaLoading && (
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
                              columns={
                                stream.metadata[0].metadata[
                                  'valid-replication-keys'
                                ] || []
                              }
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
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
