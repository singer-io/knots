// @flow
import React, { Component } from 'react';
import { Container, Alert } from 'reactstrap';

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

  render() {
    const { dockerVersion } = this.props.knotsStore;

    return (
      <div>
        <Header />

        <Container className="mt-5">
          {!dockerVersion && (
            <Alert color="danger" style={{ opacity: 1 }} isOpen>
              Oops! Docker must be installed before you can proceed.{' '}
              <a
                className="alert-link"
                href="https://store.docker.com/editions/community/docker-ce-desktop-mac"
                target="_target"
              >
                Click here to download it.
              </a>
            </Alert>
          )}
          <Create dockerVersion={dockerVersion} />
        </Container>
      </div>
    );
  }
}
