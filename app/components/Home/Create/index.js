// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button } from 'reactstrap';

type Props = {
  dockerVersion: string
};

class Create extends Component<Props> {
  render() {
    return (
      <Card className="card text-center">
        <CardBody className="py-5">
          <h3>
            There is <em>knothing</em> here yet.
          </h3>
          <p>
            Knot allows you to configure and download executable Singer
            pipelines.
          </p>
          <Link to="/taps">
            <Button
              outline
              color="secondary"
              disabled={!this.props.dockerVersion}
              className="mt-3"
            >
              Get Started
            </Button>
          </Link>
        </CardBody>
      </Card>
    );
  }
}

export default Create;
