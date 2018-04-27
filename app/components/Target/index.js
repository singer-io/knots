// @flow
import React from 'react';
import styles from './Target.css';

type Props = {
  logo: string,
  name: string,
  repo: string,
  tapKey: string,
  version: string,
  selectTap: (tap: string, version: string) => void
};

const Target = (props: Props) => (
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
      <button
        className={styles.name}
        onClick={() => {
          props.selectTap(props.tapKey, props.version);
        }}
      >
        {props.name}
      </button>
      <div className={styles.repo}>
        <a href={props.repo} target="_blank">
          View repo
        </a>
      </div>
    </div>
  </div>
);

export default Target;
