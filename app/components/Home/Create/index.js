// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron } from 'reactstrap';

import Header from '../../Header';

const Create = () => (
  <div>
    <Header />
    <div className="container mt-5">
      <Jumbotron>
        <h1 className="display-4">
          There is <em>knothing</em> here!
        </h1>
        <p className="lead">
          This app allows you to configure and download executable Singer
          pipelines.
        </p>
        <Link className="btn btn-primary btn-lg" to="/taps" role="button">
          Get Started
        </Link>
      </Jumbotron>
    </div>
  </div>
);

export default Create;
