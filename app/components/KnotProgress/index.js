import React from 'react';
import { Progress, Nav } from 'reactstrap';

import Item from './Item';

import styles from './KnotProgress.css';

type Props = {
  progressStore: Array<{
    text: string
  }>
};

const KnotProgress = (props: Props) => (
  <div>
    <div className={styles.progress}>
      <Progress bar color="success" value="75" />
    </div>
    <Nav pills justified>
      {props.progressStore.map((item, index) => (
        <Item key={item.text} index={index} {...item} />
      ))}
    </Nav>
  </div>
);

export default KnotProgress;
