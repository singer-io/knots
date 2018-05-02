import { UPDATE_TAPS, SCHEMA_LOADING } from '../actions/taps';
import { TARGETS_LOADING, TARGET_CONFIGURING } from '../actions/targets';
import { KNOT_SYNCED } from '../actions/knots';

export type tapsStateType = {
  +items: [{ active: boolean }]
};

const defaultState = {
  0: {
    text: 'Configure Tap',
    href: 'configure-tap',
    complete: false,
    active: false
  },
  1: {
    text: 'Replication Options',
    href: 'replication-options',
    complete: false,
    active: false
  },
  2: {
    text: 'Configure Target',
    href: 'configure-target',
    complete: false,
    active: false
  },
  3: { text: 'Save & Run', href: 'run', complete: false, active: false }
};

export default function progress(state = defaultState, action) {
  switch (action.type) {
    case UPDATE_TAPS:
      return Object.assign({}, state, {
        0: {
          text: 'Configure Tap',
          href: 'configure-tap',
          complete: false,
          active: true
        }
      });
    case SCHEMA_LOADING:
      return Object.assign({}, state, {
        0: {
          text: 'Configure Tap',
          href: 'configure-tap',
          complete: true,
          active: false
        },
        1: {
          text: 'Replication Options',
          href: 'replication-options',
          complete: false,
          active: true
        }
      });
    case TARGETS_LOADING:
      return Object.assign({}, state, {
        1: {
          text: 'Replication Options',
          href: 'replication-options',
          complete: true,
          active: false
        },
        2: {
          text: 'Configure Target',
          href: 'configure-target',
          complete: false,
          active: true
        }
      });
    case TARGET_CONFIGURING:
      return Object.assign({}, state, {
        2: {
          text: 'Configure Target',
          href: 'configure-target',
          complete: true,
          active: false
        },
        3: {
          text: 'Save & Run',
          href: 'run',
          complete: false,
          active: true
        }
      });
    case KNOT_SYNCED:
      return Object.assign({}, state, {
        3: {
          text: 'Save & Run',
          href: 'run',
          complete: true,
          active: false
        }
      });
    default:
      return state;
  }
}
