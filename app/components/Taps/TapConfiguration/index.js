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
import { Container, Row } from 'reactstrap';

import Redshift from '../../../containers/Redshift';
import Salesforce from '../../../containers/Salesforce';
import Postgres from '../../../containers/Postgres';
import Adwords from '../../../containers/Adwords';
import MySQL from '../../../containers/MySQL';
import Facebook from '../../../containers/Facebook';

type Props = {
  tapsStore: {
    selectedTap: { name: string, image: string }
  }
};

export default class Tap extends Component<Props> {
  selectedTarget = () => {
    const { selectedTap } = this.props.tapsStore;
    switch (selectedTap.name) {
      case 'tap-redshift':
        return <Redshift />;
      case 'tap-salesforce':
        return <Salesforce />;
      case 'tap-postgres':
        return <Postgres />;
      case 'tap-adwords':
        return <Adwords />;
      case 'tap-mysql':
        return <MySQL />;
      case 'tap-facebook':
        return <Facebook />;
      default:
        return <div>Unknown Tap</div>;
    }
  };
  render() {
    return (
      <Container>
        <Row>{this.selectedTarget()}</Row>
      </Container>
    );
  }
}
