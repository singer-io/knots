import React from 'react';
import { Progress, Nav } from 'reactstrap';

import Item from './Item';

import styles from './KnotProgress.css';

type Props = {
  progressStore: {}
};

const KnotProgress = (props: Props) => (
  <div>
    <div className={styles.progress}>
      <Progress bar color="success" value="0" />
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
  </div>
);

export default KnotProgress;
