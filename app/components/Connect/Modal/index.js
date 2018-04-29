import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

type Props = {
  showModal: boolean,
  toggle: () => void,
  headerText: string,
  body: string,
  error: string,
  reconfigure: () => void
};

export default class Modals extends Component<Props> {
  render() {
    return (
      <Modal fade={false} isOpen={this.props.showModal}>
        <ModalHeader className="text-danger">
          <span className="oi oi-warning" /> {this.props.headerText}
        </ModalHeader>
        <ModalBody>
          <p>{this.props.body}</p>
          <pre className="bg-light border border-light p-1 rounded">
            {this.props.error}
          </pre>
        </ModalBody>
        <ModalFooter>
          <a href="" className="mr-auto text-secondary">
            <small>Contact Support</small>
          </a>
          <Button outline color="secondary" onClick={this.props.toggle}>
            Abort
          </Button>
          <Button
            name="reconfigure"
            color="primary"
            onClick={this.props.reconfigure}
          >
            Reconfigure
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
