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
import {
  Alert,
  Button,
  Container,
  Progress,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { shell } from 'electron';

import type { KnotType } from '../../utils/sharedTypes';

import Knots from '../../containers/Knots';
import Header from '../Header';
import Create from './Create';

type Props = {
  verifyDocker: () => void,
  getKnots: () => void,
  knotsStore: {
    detectingDocker: boolean,
    dockerVerified: boolean,
    dockerVersion: string,
    dockerRunning: boolean,
    fetchingKnots: boolean,
    knots: Array<{}>
  },
  resetStore: () => void,
  deleteKnot: (knot: string) => void,
  downloadKnot: (knot: string) => void
};

type State = {
  dockerInstalled: boolean,
  dockerRunning: boolean,
  knot: KnotType,
  showDelete: boolean,
  showDownloadDisclaimer: boolean
};

export default class Home extends Component<Props, State> {
  state = {
    dockerInstalled: !!this.props.knotsStore.dockerVersion,
    dockerRunning: this.props.knotsStore.dockerRunning,
    knot: {},
    showDelete: false,
    showDownloadDisclaimer: false
  };

  componentWillMount() {
    // reset the store
    this.props.resetStore();
    this.props.verifyDocker();
    this.props.getKnots();
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      dockerInstalled: !!nextProps.knotsStore.dockerVersion,
      dockerRunning: nextProps.knotsStore.dockerRunning
    });
  }

  onDismiss = () => {
    this.setState({ dockerInstalled: true, dockerRunning: true });

    // Alert will disappear then reappear after one second
    // if Docker hasn't been installed
    setTimeout(() => {
      this.props.verifyDocker();
    }, 1000);
  };

  openLink = (e: SyntheticEvent<HTMLButtonElement>, url: string) => {
    e.preventDefault();
    shell.openExternal(url);
  };

  toggleDelete = (knot?: KnotType) => {
    this.setState({
      showDelete: !this.state.showDelete,
      knot: knot || {}
    });
  };

  toggleDownloadDisclaimer = (knot?: KnotType) => {
    this.setState({
      showDownloadDisclaimer: !this.state.showDownloadDisclaimer,
      knot: knot || {}
    });
  };

  render() {
    const {
      detectingDocker,
      dockerVerified,
      fetchingKnots,
      knots
    } = this.props.knotsStore;

    const { dockerInstalled, dockerRunning, knot } = this.state;

    return (
      <div>
        <Header />
        {detectingDocker &&
          fetchingKnots && (
            <Progress value="100" striped animated className="mt-5" />
          )}
        <Container className="mt-5">
          {dockerVerified && (
            <div>
              <Alert
                isOpen={!dockerInstalled || !dockerRunning}
                color="warning"
              >
                <div className="d-flex justify-content-between">
                  <p className="align-self-center mb-0">
                    <strong>
                      {dockerInstalled
                        ? 'Wake up, Docker!'
                        : 'Where are you, Docker?'}
                    </strong>&nbsp; Please make sure that Docker is{' '}
                    {dockerInstalled ? 'running' : 'installed'}
                    &nbsp;and try again.
                    <br />
                    <small>
                      KNOTS uses&nbsp;
                      <a
                        href="#"
                        onClick={(e) =>
                          this.openLink(
                            e,
                            'https://www.docker.com/community-edition#/overview'
                          )
                        }
                        className="alert-link"
                      >
                        Docker
                      </a>
                      &nbsp;to run pipelines reliably on various operating
                      systems.
                    </small>
                  </p>
                  <div className="align-self-center">
                    {dockerInstalled ? (
                      <Button
                        outline
                        color="warning"
                        className="mr-2"
                        onClick={(e) => {
                          this.openLink(
                            e,
                            'https://docs.docker.com/docker-for-mac/install/#install-and-run-docker-for-mac'
                          );
                        }}
                      >
                        Start Docker
                      </Button>
                    ) : (
                      <Button
                        outline
                        color="warning"
                        className="mr-2"
                        onClick={(e) => {
                          this.openLink(
                            e,
                            'https://store.docker.com/editions/community/docker-ce-desktop-mac'
                          );
                        }}
                      >
                        Install Docker
                      </Button>
                    )}
                    <Button color="warning" onClick={this.onDismiss}>
                      Retry
                    </Button>
                  </div>
                </div>
              </Alert>
              {knots.length > 0 && (
                <Knots
                  dockerInstalled={dockerInstalled}
                  dockerRunning={dockerRunning}
                  toggleDelete={this.toggleDelete}
                  toggleDownloadDisclaimer={this.toggleDownloadDisclaimer}
                />
              )}
              {knots.length === 0 && <Create {...this.state} />}
            </div>
          )}
        </Container>
        <Modal
          isOpen={this.state.showDelete}
          toggle={() => this.toggleDelete()}
        >
          <ModalHeader toggle={() => this.toggleDelete()}>
            Delete <strong>{knot.name}</strong>?
          </ModalHeader>
          <ModalBody>
            Are you sure you want to delete <strong>{knot.name}</strong>? Once
            you delete a knot, there is no going back.
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              outline
              onClick={() => this.toggleDelete()}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.props.deleteKnot(this.state.knot.name);
                this.toggleDelete();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.showDownloadDisclaimer}
          toggle={() => this.toggleDownloadDisclaimer()}
        >
          <ModalHeader toggle={() => this.toggleDownloadDisclaimer()}>
            Download <strong>{knot.name}</strong>?
          </ModalHeader>
          <ModalBody>
            The file you are downloading may contain personal information, like
            your name and password. By continuing to download, you agree it is
            your sole responsibility to protect and secure that information.
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              outline
              onClick={this.toggleDownloadDisclaimer}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.props.downloadKnot(this.state.knot.name);
                this.toggleDownloadDisclaimer();
              }}
            >
              Download
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
