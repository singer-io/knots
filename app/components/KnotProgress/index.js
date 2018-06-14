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

import React from 'react';
import { Row, Col, Progress, Nav } from 'reactstrap';

import Item from './Item';

import styles from './KnotProgress.css';

type Props = {
  progressStore: {},
  tapsStore: { selectedTap: { name: string } },
  targetsStore: { selectedTarget: { name: string } },
  knotsStore: { knotName: string }
};

const calculateProgress = (items) => {
  let indexOfActiveItem = 0;
  Object.keys(items).forEach((key, index) => {
    if (items[key].active) {
      indexOfActiveItem = index;
    }
  });

  if (items[3].complete) {
    return 100;
  }

  return indexOfActiveItem * 33.3;
};

const KnotProgress = (props: Props) => (
  <Row>
    <Col md={{ size: 8, offset: 2 }}>
      <Progress
        color="success"
        value={calculateProgress(props.progressStore)}
        className={styles.progress}
        style={{ height: '2px' }}
      />

      <Nav pills justified>
        {Object.keys(props.progressStore).map((item) => (
          <Item
            key={item}
            index={parseInt(item, 10)}
            {...props.progressStore[item]}
            tapsStore={props.tapsStore}
            targetsStore={props.targetsStore}
            knotsStore={props.knotsStore}
          />
        ))}
      </Nav>
    </Col>
  </Row>
);

export default KnotProgress;
