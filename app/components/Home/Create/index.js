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
import { Link } from 'react-router-dom';
import { Card, CardBody, Button } from 'reactstrap';

type Props = {
  dockerInstalled: boolean,
  dockerRunning: boolean
};

class Create extends Component<Props> {
  render() {
    const { dockerInstalled, dockerRunning } = this.props;

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
              disabled={!dockerInstalled || !dockerRunning}
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
