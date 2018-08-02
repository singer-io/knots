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

import { shell } from 'electron';
import type {
  RedshiftState,
  PostgresState,
  SalesforceState,
  AdwordsState,
  MySQLState
} from './sharedTypes';

// $FlowFixMe
/* eslint-disable */
export function openLink(e: SyntheticEvent<HTMLAnchorElement>) {
  e.preventDefault();
  // $FlowFixMe
  shell.openExternal(e.target.href);
}

export const toISODateString = (date: Date) =>
  `${date.toISOString().split('.')[0]}Z`;

export const formatDate = (ISODate: string) => ISODate.split('T')[0];

export const formValid = (fields: {}) => {
  let valid = true;
  Object.keys(fields).forEach((field) => {
    if (fields[field].errorMessage) {
      valid = false;
    }
  });

  return valid;
};

export const showValidation = (field: string, state: {}) => {
  const fieldError = state[field].errorMessage;

  if (fieldError) {
    return {
      [field]: Object.assign(state[field], {
        validation: { invalid: true }
      })
    };
  } else {
    return {
      [field]: Object.assign(state[field], {
        validation: { valid: true }
      })
    };
  }
};

export const validateFields = (
  fieldValues: {},
  state:
    | SalesforceState
    | RedshiftState
    | PostgresState
    | AdwordsState
    | MySQLState
) => {
  const fieldNames = Object.keys(fieldValues);

  fieldNames.forEach((field) => {
    const fieldValue = fieldValues[field];

    if (field === 'host') {
      if (fieldValue) {
        // Ensure a loopback address hasn't been provided
        const loopBackAddresses = /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*:)*?:?0*1$/;
        if (loopBackAddresses.test(fieldValue.toString())) {
          return {
            // $FlowFixMe
            host: Object.assign(state.host, {
              errorMessage: 'KNOTS does not support loopback addresses'
            })
          };
        } else {
          // All checks pass
          return {
            // $FlowFixMe
            host: Object.assign(state.host, {
              errorMessage: ''
            })
          };
        }
      } else {
        // If no value is provided let the user know the field is required
        return {
          // $FlowFixMe
          host: Object.assign(state.host, {
            errorMessage: 'Must be a valid server hostname or IP address'
          })
        };
      }
    } else if (fieldValue) {
      return {
        [field]: Object.assign(state[field], {
          errorMessage: ''
        })
      };
    } else {
      return {
        [field]: Object.assign(state[field], {
          errorMessage: 'Required'
        })
      };
    }
  });
};
