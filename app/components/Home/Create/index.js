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
import { Button, Jumbotron } from 'reactstrap';
import { shell } from 'electron';

type Props = {
  dockerInstalled: boolean,
  dockerRunning: boolean,
  generateUUID: () => void
};

class Create extends Component<Props> {
  openLink = (e: SyntheticEvent<HTMLButtonElement>, url: string) => {
    e.preventDefault();
    shell.openExternal(url);
  };

  render() {
    const { dockerInstalled, dockerRunning, generateUUID } = this.props;

    return (
      <Jumbotron>
        <h1 className="display-4">
          There is <em>knothing</em> here yet.
        </h1>
        <p className="lead">
          KNOTS allows you to set up simple data pipelines leveraging{' '}
          <a href="#" onClick={(e) => this.openLink(e, 'https://singer.io')}>
            Singer
          </a>
          &nbsp;open-source technology.
        </p>
        <Link to="/taps">
          <Button
            color="primary"
            disabled={!dockerInstalled || !dockerRunning}
            className="mt-3"
            onClick={generateUUID}
          >
            Get Started
          </Button>
        </Link>
      </Jumbotron>
    );
  }
}

export default Create;
