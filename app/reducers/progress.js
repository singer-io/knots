import { UPDATE_TAPS } from '../actions/taps';

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
    text: 'Configure Target',
    href: 'configure-target',
    complete: false,
    active: false
  },
  4: { text: 'Save/Run', href: 'run', complete: false, active: false }
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
    default:
      return state;
  }
}
