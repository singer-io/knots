import { UPDATE_TAPS, SCHEMA_LOADING } from '../actions/taps';
import { TARGETS_LOADING, TARGET_CONFIGURING } from '../actions/targets';
import { KNOT_SYNCED, FINAL_STEP } from '../actions/knots';

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
  3: { text: 'Save & Run', href: 'sync', complete: false, active: false }
};

export default function progress(state = defaultState, action) {
  switch (action.type) {
    case UPDATE_TAPS:
      return Object.assign({}, state, {
        0: {
          text: 'Configure Tap',
          href: '/taps',
          complete: false,
          active: true
        }
      });
    case SCHEMA_LOADING:
      return Object.assign({}, state, {
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
        }
      });
    case TARGETS_LOADING:
      return Object.assign({}, state, {
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
        }
      });
    case TARGET_CONFIGURING:
      return Object.assign({}, state, {
        2: {
          text: 'Configure Target',
          href: '/targets',
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
          href: 'sync',
          complete: true,
          active: false
        }
      });
    case FINAL_STEP:
      return Object.assign({}, state, {
        0: {
          text: 'Configure Tap',
          href: '/taps',
          complete: true,
          active: true
        },
        1: {
          text: 'Replication Options',
          href: '/schema',
          complete: true,
          active: true
        },
        2: {
          text: 'Configure Target',
          href: '/targets',
          complete: true,
          active: true
        },
        3: { text: 'Save & Run', href: 'sync', complete: false, active: true }
      });
    default:
      return state;
  }
}
