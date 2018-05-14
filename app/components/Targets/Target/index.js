// @flow
import React from 'react';
import styles from './Target.css';

type Props = {
  logo: string,
  name: string,
  repo: string,
  targetKey: string,
  targetImage: string,
  selectTarget: (tap: string, version: string) => void
};

const Target = (props: Props) => (
  <div className={styles.Target}>
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
          props.selectTarget(props.targetKey, props.targetImage);
        }}
      >
        {props.name}
      </button>
      <div className={styles.repo}>
        <a href={props.repo} target="_blank">
          Learn more
        </a>
      </div>
    </div>
  </div>
);

export default Target;
