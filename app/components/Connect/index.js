// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Header from '../Header';
import Loader from '../Loader';
import KnotProgress from '../../containers/KnotProgress';
import ConnectForm from './ConnectForm';

type Props = {
  tapsStore: {
    schema: Array<{}>,
    tapsLoading: boolean,
    tapFields: Array<{
      key: string,
      label: string
    }>,
    fieldValues: {},
    error: string,
    showModal: boolean
  },
  toggle: () => void,
  updateTapField: (key: string, value: string) => void,
  submitConfig: (fieldValues: {}) => void
};

export default class Taps extends Component<Props> {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggle();
  }

  handleChange = (event: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = event.currentTarget;
    this.props.updateTapField(name, value);
  };

  submit = () => {
    this.props.submitConfig(this.props.tapsStore.fieldValues);
  };

  render() {
    const { tapsLoading, schema, error, showModal } = this.props.tapsStore;
    if (schema.length > 0) {
      return <Redirect push to="/schema" />;
    }

    return (
      <div>
        <Header />
        {tapsLoading && <Loader />}
        {!tapsLoading && <KnotProgress />}
        {!tapsLoading && (
          <ConnectForm
            fields={this.props.tapsStore.tapFields}
            handleChange={this.handleChange}
            submit={this.submit}
          />
        )}
        {error && (
          <Modal fade={false} isOpen={showModal} toggle={this.toggle}>
            <ModalHeader>
              <span className="oi oi-warning" /> Tap error
            </ModalHeader>
            <ModalBody>
              Unable too execute tap in discovery mode.
              <pre className="bg-light border border-light p-1 rounded">
                {error}
              </pre>
            </ModalBody>
            <ModalFooter>
              <a href="" className="mr-auto text-secondary">
                <small>Contact Support</small>
              </a>
              <Button color="secondary" onClick={this.toggle}>
                Abort
              </Button>
              <Button color="primary" onClick={this.toggle}>
                Reconfigure
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </div>
    );
  }
}
