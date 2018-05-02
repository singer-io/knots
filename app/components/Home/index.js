// @flow
import React, { Component } from 'react';
import { Container, Alert } from 'reactstrap';
import { shell } from 'electron';
import classNames from 'classnames';

import Header from '../Header';
import Create from './Create';

import styles from './Home.css';

type Props = {
  detectDocker: () => void,
  knotsStore: {
    dockerVersionDetected: boolean,
    dockerVersion: string
  }
};

type State = {
  showError: boolean
};

export default class Home extends Component<Props, State> {
  state = {
    showError: false
  };

  componentWillMount() {
    this.props.detectDocker();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.knotsStore.dockerVersion) {
      this.setState({ showError: true });
    }
  }

  onDismiss = () => {
    this.setState({ showError: false });

    // Alert will disappear then reappear after one second
    // if Docker hasn't been installed
    setTimeout(() => {
      this.props.detectDocker();
    }, 1000);
  };

  dockerDownload = () => {
    shell.openExternal(
      'https://store.docker.com/editions/community/docker-ce-desktop-mac'
    );
  };

  render() {
    const { dockerVersionDetected, dockerVersion } = this.props.knotsStore;

    return (
      <div>
        <Header />

        <Container className="mt-5">
          {dockerVersionDetected && (
            <Alert
              color="danger"
              style={{ opacity: 1 }}
              isOpen={this.state.showError}
              toggle={this.onDismiss}
            >
              Oops! Docker must be installed before you can proceed.{' '}
              <button
                onClick={this.dockerDownload}
                className={classNames('alert-link', styles.download)}
              >
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
