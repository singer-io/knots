// @flow
import React from 'react';
import type { Node } from 'react';

import './Header.css';
import styles from './Header.css';

type Props = {
  children?: Node
};

const Header = (props: Props) => (
  <div className={styles.Header}>
    <h2 className={styles.title}>{props.children}</h2>
  </div>
);

Header.defaultProps = {
  children: ''
};

export default Header;
