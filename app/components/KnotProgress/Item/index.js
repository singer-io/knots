// @flow

import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
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
      {console.log('Props', props)}
      <span
        className={classNames('oi', 'oi-check', styles.checkIcon, {
          [styles.hidden]: !props.complete
        })}
      />
    </NavLink>
    <small>{props.text}</small>
  </NavItem>
);

export default KnotProgress;
