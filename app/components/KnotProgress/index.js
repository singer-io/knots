import React from 'react';
import { Progress, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';

import styles from './KnotProgress.css';

const KnotProgress = () => (
  <div>
    <div className={styles.progress}>
      <Progress bar color="success" value="75" />
    </div>
    <Nav pills justified>
      <NavItem>
        <NavLink
          href="/select-tap"
          className={classNames(styles.navLink, { [styles.completed]: false })}
        >
          <span className={classNames(styles.step, { [styles.hidden]: false })}>
            1
          </span>
          <span
            className={classNames('oi', 'oi-check', styles.icon, {
              [styles.hidden]: true
            })}
          />
        </NavLink>
        <small>Select Tap</small>
      </NavItem>
      <NavItem>
        <NavLink
          href="/configure-tap"
          className={classNames(styles.navLink, { [styles.completed]: false })}
        >
          <span className={classNames(styles.step, { [styles.hidden]: false })}>
            2
          </span>
          <span
            className={classNames('oi', 'oi-check', styles.icon, {
              [styles.hidden]: true
            })}
          />
        </NavLink>
        <small>Configure Tap</small>
      </NavItem>
      <NavItem>
        <NavLink
          href="/replication-options"
          className={classNames(styles.navLink, { [styles.completed]: false })}
        >
          <span className={classNames(styles.step, { [styles.hidden]: false })}>
            3
          </span>
          <span
            className={classNames('oi', 'oi-check', styles.icon, {
              [styles.hidden]: true
            })}
          />
        </NavLink>
        <small>Replication Options</small>
      </NavItem>
      <NavItem>
        <NavLink
          href="/configure-target"
          className={classNames(styles.navLink, { [styles.completed]: false })}
        >
          <span className={classNames(styles.step, { [styles.hidden]: false })}>
            4
          </span>
          <span
            className={classNames('oi', 'oi-check', styles.icon, {
              [styles.hidden]: true
            })}
          />
        </NavLink>
        <small>Configure Target</small>
      </NavItem>
      <NavItem>
        <NavLink
          href="/run"
          className={classNames(styles.navLink, { [styles.completed]: false })}
        >
          <span className={classNames(styles.step, { [styles.hidden]: false })}>
            5
          </span>
          <span
            className={classNames('oi', 'oi-check', styles.icon, {
              [styles.hidden]: true
            })}
          />
        </NavLink>
        <small>Save/Run</small>
      </NavItem>
    </Nav>
  </div>
);

export default KnotProgress;
