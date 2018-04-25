// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Tap.css';

type Props = {
  logo: string,
  name: string,
  repo: string,
  tapKey: string,
  version: string
};

const Tap = (props: Props) => (
  <div className={styles.Tap}>
    <div className={styles.logoContainer}>
      <img
        className="mr-3"
        style={{ maxWidth: '64px' }}
        src={props.logo}
        alt={props.name}
      />
    </div>
    <div className={styles.info}>
      <Link to={`/connect/?tap=${props.tapKey}&version=${props.version}`}>
        <h5 className={styles.name}>{props.name}</h5>
      </Link>
      <div className={styles.repo}>
        <a href={props.repo} target="_blank">
          View repo
        </a>
      </div>
    </div>
  </div>
);

export default Tap;
