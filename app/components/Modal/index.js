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

import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

type Props = {
  showModal: boolean,
  toggle: () => void,
  headerText: string,
  body: React.Node,
  error: string,
  reconfigure: () => void,
  buttonText: string
};

export default class ErrorModal extends Component<Props> {
  render() {
    return (
      <Modal fade={false} isOpen={this.props.showModal}>
        <ModalHeader className="text-danger">
          <span className="oi oi-warning" /> {this.props.headerText}
        </ModalHeader>
        <ModalBody>
          {this.props.body}
          {this.props.error && (
            <pre className="bg-light border border-light p-1 rounded">
              <p>Error Details:</p>
              {this.props.error}
            </pre>
          )}
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
            {this.props.buttonText}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
