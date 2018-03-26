// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import styles from './Navigation.css';

type Props = {
  back: { name: string, path: string },
  next: { name: string, path: string, onClick: () => void }
};

const Navigation = (props: Props) => (
  <div className={styles.navigation}>
    <Link to={props.back.path}>
      <Button>
        <i className="fa fa-long-arrow-left" aria-hidden="true" />
        {`Back: ${props.back.name}`}
      </Button>
    </Link>
    <Link to={props.next.path}>
      <Button bsStyle="primary" onClick={props.next.onClick}>
        {`Next: ${props.next.name}`}
        <i className="fa fa-long-arrow-right" aria-hidden="true" />
      </Button>
    </Link>
  </div>
);

export default Navigation;
