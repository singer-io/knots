import {
  UPDATE_TAPS,
  UPDATE_TAP_FIELDS,
  SCHEMA_RECEIVED,
  SCHEMA_UPDATED
} from '../actions/taps';

import { TARGET_INSTALLED } from '../actions/targets';

export type tapsStateType = {
  +items: [{ active: boolean }]
};

const defaultState = {
  0: { text: 'Select Tap', href: 'select-tap', complete: false, active: false },
  1: {
    text: 'Configure Tap',
    href: 'configure-tap',
    complete: false,
    active: false
  },
  2: {
    text: 'Replication Options',
    href: 'replication-options',
    complete: false,
    active: false
  },
  3: {
    text: 'Select Target',
    href: 'select-target',
    complete: false,
    active: false
  },
  4: {
    text: 'Configure Target',
    href: 'configure-target',
    complete: false,
    active: false
  },
  5: { text: 'Save/Run', href: 'run', complete: false, active: false }
};

export default function progress(state = defaultState, action) {
  switch (action.type) {
    case UPDATE_TAPS:
      return Object.assign({}, state, {
        0: {
          text: 'Select Tap',
          href: 'select-tap',
          complete: false,
          active: true
        }
      });
    case UPDATE_TAP_FIELDS:
      return Object.assign({}, state, {
        0: {
          text: 'Select Tap',
          href: 'select-tap',
          complete: true,
          active: false
        },
        1: {
          text: 'Configure Tap',
          href: 'configure-tap',
          complete: false,
          active: true
        }
      });
    case SCHEMA_RECEIVED:
      return Object.assign({}, state, {
        1: {
          text: 'Configure Tap',
          href: 'configure-tap',
          complete: true,
          active: false
        },
        2: {
          text: 'Replication Options',
          href: 'replication-options',
          complete: false,
          active: true
        }
      });
    case SCHEMA_UPDATED:
      return Object.assign({}, state, {
        2: {
          text: 'Replication Options',
          href: 'replication-options',
          complete: true,
          active: false
        },
        3: {
          text: 'Select Target',
          href: 'select-target',
          complete: false,
          active: true
        }
      });
    case TARGET_INSTALLED:
      return Object.assign({}, state, {
        3: {
          text: 'Select Target',
          href: 'select-target',
          complete: true,
          active: false
        },
        4: {
          text: 'Configure Target',
          href: 'configure-target',
          complete: false,
          active: true
        }
      });
    default:
      return state;
  }
}
