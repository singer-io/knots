// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Target.css';

type Props = {
  logo: string,
  name: string,
  target: string,
  version: string
};

const Target = (props: Props) => (
  <div className={styles.Target}>
    <Link to={`/target/?target=${props.target}&version=${props.version}`}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={props.logo} alt="Target logo" />
      </div>
    </Link>
    <div className={styles.info}>
      <Link to={`/target/?target=${props.target}&version=${props.version}`}>
        <div className={styles.name}>{props.name}</div>
      </Link>
    </div>
  </div>
);

export default Target;
