// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Button, Alert } from 'reactstrap';

import Header from '../../Header';

type Props = {
  showAlert: boolean
};

type State = {
  visible: boolean
};

class Create extends Component<Props, State> {
  constructor() {
    super();
    this.state = { visible: false };
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.showAlert });
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <div>
        <Header />
        <Container className="mt-5">
          <Alert
            color="danger"
            style={{ opacity: 1 }}
            isOpen={this.state.visible}
            toggle={this.onDismiss}
          >
            Oops! Docker must be installed before you can proceed.<a
              className="alert-link"
              href="https://store.docker.com/editions/community/docker-ce-desktop-mac"
              target="_target"
            >
              Click here to download it.
            </a>
          </Alert>
          <Jumbotron>
            <h1 className="display-4">
              There is <em>knothing</em> here!
            </h1>
            <p className="lead">
              This app allows you to configure and download executable Singer
              pipelines.
            </p>
            <Link to="/taps">
              <Button color="primary" size="lg">
                Get Started
              </Button>
            </Link>
          </Jumbotron>
        </Container>
      </div>
    );
  }
}

export default Create;
