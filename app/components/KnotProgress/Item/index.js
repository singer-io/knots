/*
 * knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the
 * License.
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc.(http://data.world/).
 */

// @flow
/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import { NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import styles from './Item.css';

type Props = {
  text: string,
  index: number,
  complete: boolean,
  active: boolean,
  href: string,
  tapsStore: { selectedTap: { name: string }, schema: Array<{}> },
  targetsStore: { selectedTarget: { name: string } },
  knotsStore: { knotName: string },
  userStore: {}
};

const makeLink = (page: string, props: Props) => {
  const tapsConfigured = !!props.tapsStore.selectedTap.name;
  const schemaConfigured = props.tapsStore.schema.length > 0;
  const targetsConfigured = !!props.targetsStore.selectedTarget.name;
  const readyToSync = () => {
    const selectedTarget = props.targetsStore.selectedTarget.name;

    if (selectedTarget) {
      const targetFieldValues = props.userStore[selectedTarget].fieldValues;

      let valid = true;

      Object.keys(targetFieldValues).forEach((field) => {
        if (!targetFieldValues[field]) {
          valid = false;
        }
      });

      return valid;
    }

    return false;
  };

  switch (page) {
    case '/taps':
      return tapsConfigured;
    case '/schema':
      return schemaConfigured;
    case '/targets':
      return targetsConfigured;
    case '/sync':
      return readyToSync();
    default:
      return false;
  }
};

const KnotProgress = (props: Props) => {
  const clickable = makeLink(props.href, props);
  if (clickable) {
    return (
      <NavItem>
        <Link to={props.href} className={styles.link}>
          <div
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
          </div>
          <small style={{ color: 'black' }}>{props.text}</small>
        </Link>
      </NavItem>
    );
  }

  return (
    <NavItem>
      <div
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
      </div>
      <small style={{ color: 'black' }}>{props.text}</small>
    </NavItem>
  );
};

export default KnotProgress;
