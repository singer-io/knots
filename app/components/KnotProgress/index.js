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

  if (items[3].complete) {
    return 100;
  }

  return indexOfActiveItem * 33.3;
};

const currentActive = (items) => {
  let active = '';
  Object.keys(items).forEach((key) => {
    if (items[key].active) {
      active = items[key].text;
    }
  });

  return active;
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
          />
        ))}
      </Nav>
      <p className="display-4 mt-4">{currentActive(props.progressStore)}</p>
    </Col>
  </Row>
);

export default KnotProgress;
