// @flow
/*
 * Knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import styles from './Navigation.css';

type Props = {
  back: { name: string, path: string },
  next: { name: string, path: string, onClick: () => void }
};

const Navigation = (props: Props) => (
  <div className={styles.navigation}>
    <Link to={props.back.path}>
      <Button>
        <i className="fa fa-long-arrow-left" aria-hidden="true" />
        {`Back: ${props.back.name}`}
      </Button>
    </Link>
    <Link to={props.next.path}>
      <Button bsStyle="primary" onClick={props.next.onClick}>
        {`Next: ${props.next.name}`}
        <i className="fa fa-long-arrow-right" aria-hidden="true" />
      </Button>
    </Link>
  </div>
);

export default Navigation;
