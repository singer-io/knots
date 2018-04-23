// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Button } from 'reactstrap';

import Header from '../../Header';

const Create = () => (
  <div>
    <Header />
    <Container className="mt-5">
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

export default Create;
