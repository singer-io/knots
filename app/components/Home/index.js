// @flow
import React, { Component } from 'react';
import { Container, Alert } from 'reactstrap';
import { shell } from 'electron';

import Header from '../Header';
import Create from './Create';

type Props = {
  detectDocker: () => void,
  knotsStore: {
    dockerVersion: string
  }
};

export default class Home extends Component<Props> {
  componentWillMount() {
    this.props.detectDocker();
  }

  dockerDownload = () => {
    shell.openExternal(
      'https://store.docker.com/editions/community/docker-ce-desktop-mac'
    );
  };

  render() {
    const { dockerVersion } = this.props.knotsStore;

    return (
      <div>
        <Header />

        <Container className="mt-5">
          {!dockerVersion && (
            <Alert color="danger" style={{ opacity: 1 }} isOpen>
              Oops! Docker must be installed before you can proceed.{' '}
              <button className="alert-link" onClick={this.dockerDownload}>
                Click here to download it.
              </button>
            </Alert>
          )}
          <Create dockerVersion={dockerVersion} />
        </Container>
      </div>
    );
  }
}
