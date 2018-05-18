// @flow

import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import styles from './Item.css';

type Props = {
  text: string,
  index: number,
  complete: boolean,
  active: boolean,
  href: string
};

const KnotProgress = (props: Props) => (
  <NavItem>
    <Link to={props.href}>
      <NavLink
        href={props.href}
        className={classNames(styles.navLink, {
          [styles.completed]: props.complete,
          [styles.active]: props.active
        })}
      >
        <span
          className={classNames(styles.step, {
            [styles.hidden]: props.complete
          })}
        >
          {props.index + 1}
        </span>
        <span
          style={{ display: props.complete ? 'inline-block' : 'none' }}
          className={classNames('oi', 'oi-check', styles.checkIcon)}
        />
      </NavLink>
      <small style={{ color: 'black' }}>{props.text}</small>
    </Link>
  </NavItem>
);

export default KnotProgress;
