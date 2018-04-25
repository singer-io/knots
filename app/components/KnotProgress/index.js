import React from 'react';
import { Row, Col, Progress, Nav } from 'reactstrap';

import Item from './Item';

import styles from './KnotProgress.css';

type Props = {
  progressStore: {}
};

const calculateProgress = (items) => {
  let indexOfActiveItem = 0;
  Object.keys(items).forEach((key, index) => {
    if (items[key].active) {
      indexOfActiveItem = index;
    }
  });

  return (indexOfActiveItem * 25).toString();
};

const KnotProgress = (props: Props) => (
  <Row>
    <Col md={{ size: 8, offset: 2 }}>
      <div className={styles.progress}>
        <Progress
          bar
          color="success"
          value={calculateProgress(props.progressStore)}
        />
      </div>
      <Nav pills justified>
        {Object.keys(props.progressStore).map((item) => (
          <Item
            key={item}
            index={parseInt(item, 10)}
            {...props.progressStore[item]}
          />
        ))}
      </Nav>
    </Col>
  </Row>
);

export default KnotProgress;
