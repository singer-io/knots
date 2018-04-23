import { UPDATE_PROGRESS } from '../actions/progress';

export type tapsStateType = {
  +items: [{ active: boolean }]
};

const defaultState = [
  { text: 'Select Tap', href: 'select-tap', complete: false, active: false },
  {
    text: 'Configure Tap',
    href: 'configure-tap',
    complete: false,
    active: false
  },
  {
    text: 'Replication Options',
    href: 'replication-options',
    complete: false,
    active: false
  },
  {
    text: 'Configure Target',
    href: 'configure-target',
    complete: false,
    active: false
  },
  { text: 'Save/Run', href: 'run', complete: false, active: false }
];

export default function progress(state = defaultState, action) {
  switch (action.type) {
    case UPDATE_PROGRESS:
      return Object.assign({}, state, { loading: false });
    default:
      return state;
  }
}
