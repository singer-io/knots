import React from 'react';
import { Progress, Nav, NavItem, NavLink } from 'reactstrap';

import styles from './KnotProgress.css';

const KnotProgress = () => (
  <div>
    {/* <ul className="nav nav-pills nav-justified">
      <li className="nav-item">
        <a href="#" className="nav-link completed">
          <span className="step">1</span>
          <span className="oi oi-check" />
        </a>
        <small>Select Tap</small>
      </li>
      <li className="nav-item">
        <a href="#" className="nav-link completed">
          <span className="step">2</span>
          <span className="oi oi-check" />
        </a>
        <small>Configure Tap</small>
      </li>
      <li className="nav-item">
        <a href="#" className="nav-link active">
          <span className="step">3</span>
          <span className="oi oi-check" />
        </a>
        <small>Replication Options</small>
      </li>
      <li className="nav-item">
        <a href="#" className="nav-link disabled">
          <span className="step">4</span>
          <span className="oi oi-check" />
        </a>
        <small>Configure Target</small>
      </li>
      <li className="nav-item">
        <a href="#" className="nav-link disabled">
          <span className="step">5</span>
          <span className="oi oi-check" />
        </a>
        <small>Save/Run</small>
      </li>
    </ul> */}
    <div className={styles.progress}>
      <Progress bar color="success" value="75" />
    </div>
    <Nav pills justified>
      <NavItem>
        <NavItem className="completed">
          <span className="step">1</span>
          <span className="oi oi-check" />
          <NavLink href="/select-tap">Select Tap</NavLink>
        </NavItem>
      </NavItem>
      <NavItem>
        <NavItem>
          <NavLink href="/configure-tap">Configure Tap</NavLink>
        </NavItem>
      </NavItem>
      <NavItem>
        <NavItem>
          <NavLink href="/replication-options">Replication Options</NavLink>
        </NavItem>
      </NavItem>
      <NavItem>
        <NavLink href="/configure-target">Configure Target</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/run">Save/Run</NavLink>
      </NavItem>
    </Nav>
  </div>
);

export default KnotProgress;
