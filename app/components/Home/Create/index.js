// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Button } from 'reactstrap';

type Props = {
  dockerVersion: string
};

class Create extends Component<Props> {
  render() {
    return (
      <Jumbotron>
        <h1 className="display-4">
          There is <em>knothing</em> here!
        </h1>
        <p className="lead">
          This app allows you to configure and download executable Singer
          pipelines.
        </p>
        <Link to="/taps">
          <Button
            color="primary"
            size="lg"
            disabled={!this.props.dockerVersion}
          >
            Get Started
          </Button>
        </Link>
      </Jumbotron>
    );
  }
}

export default Create;
