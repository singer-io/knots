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

import { TAPS_PAGE_LOADED, SCHEMA_PAGE_LOADED } from '../actions/taps';
import { TARGETS_PAGE_LOADED } from '../actions/targets';
import { RESET_STORE, SYNC_PAGE_LOADED } from '../actions/knots';

export type tapsStateType = {
  +items: [{ active: boolean }]
};

const defaultState = {
  0: {
    text: 'Configure Tap',
    href: '/taps',
    complete: false,
    active: false
  },
  1: {
    text: 'Replication Options',
    href: '/schema',
    complete: false,
    active: false
  },
  2: {
    text: 'Configure Target',
    href: '/targets',
    complete: false,
    active: false
  },
  3: { text: 'Save & Run', href: '/sync', complete: false, active: false }
};

export default function progress(state = defaultState, action) {
  switch (action.type) {
    case TAPS_PAGE_LOADED:
      return {
        0: {
          text: 'Configure Tap',
          href: '/taps',
          complete: false,
          active: true
        },
        1: {
          text: 'Replication Options',
          href: '/schema',
          complete: false,
          active: false
        },
        2: {
          text: 'Configure Target',
          href: '/targets',
          complete: false,
          active: false
        },
        3: { text: 'Save & Run', href: '/sync', complete: false, active: false }
      };
    case SCHEMA_PAGE_LOADED:
      return {
        0: {
          text: 'Configure Tap',
          href: '/taps',
          complete: true,
          active: false
        },
        1: {
          text: 'Replication Options',
          href: '/schema',
          complete: false,
          active: true
        },
        2: {
          text: 'Configure Target',
          href: '/targets',
          complete: false,
          active: false
        },
        3: { text: 'Save & Run', href: '/sync', complete: false, active: false }
      };
    case TARGETS_PAGE_LOADED:
      return {
        0: {
          text: 'Configure Tap',
          href: '/taps',
          complete: true,
          active: false
        },
        1: {
          text: 'Replication Options',
          href: '/schema',
          complete: true,
          active: false
        },
        2: {
          text: 'Configure Target',
          href: '/targets',
          complete: false,
          active: true
        },
        3: { text: 'Save & Run', href: '/sync', complete: false, active: false }
      };
    case SYNC_PAGE_LOADED:
      return {
        0: {
          text: 'Configure Tap',
          href: '/taps',
          complete: true,
          active: false
        },
        1: {
          text: 'Replication Options',
          href: '/schema',
          complete: true,
          active: false
        },
        2: {
          text: 'Configure Target',
          href: '/targets',
          complete: true,
          active: false
        },
        3: { text: 'Save & Run', href: '/sync', complete: false, active: true }
      };
    case RESET_STORE:
      // Fact that objects are passed by reference makes this necessary, open to other suggestions
      return {
        0: {
          text: 'Configure Tap',
          href: '/taps',
          complete: false,
          active: false
        },
        1: {
          text: 'Replication Options',
          href: '/schema',
          complete: false,
          active: false
        },
        2: {
          text: 'Configure Target',
          href: '/targets',
          complete: false,
          active: false
        },
        3: { text: 'Save & Run', href: '/sync', complete: false, active: false }
      };
    default:
      return state;
  }
}
