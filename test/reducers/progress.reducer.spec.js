import progressReducer, { defaultState } from '../../app/reducers/progress';
import { TAPS_PAGE_LOADED, SCHEMA_PAGE_LOADED } from '../../app/actions/taps';
import { TARGETS_PAGE_LOADED } from '../../app/actions/targets';
import { SYNC_PAGE_LOADED, RESET_STORE } from '../../app/actions/knots';

describe('progress reducer', () => {
  it('should return the initial state', () => {
    expect(progressReducer(undefined, {})).toEqual(defaultState);
  });

  it('should handle TAPS_PAGE_LOADED', () => {
    expect(
      progressReducer(undefined, {
        type: TAPS_PAGE_LOADED
      })
    ).toEqual(
      Object.assign({}, defaultState, {
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
      })
    );
  });

  it('should handle SCHEMA_PAGE_LOADED', () => {
    expect(
      progressReducer(undefined, {
        type: SCHEMA_PAGE_LOADED
      })
    ).toEqual(
      Object.assign({}, defaultState, {
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
      })
    );
  });

  it('should handle TARGETS_PAGE_LOADED', () => {
    expect(
      progressReducer(undefined, {
        type: TARGETS_PAGE_LOADED
      })
    ).toEqual(
      Object.assign({}, defaultState, {
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
      })
    );
  });

  it('should handle SYNC_PAGE_LOADED', () => {
    expect(
      progressReducer(undefined, {
        type: SYNC_PAGE_LOADED
      })
    ).toEqual(
      Object.assign({}, defaultState, {
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
      })
    );
  });

  it('should handle RESET_STORE', () => {
    expect(
      progressReducer(undefined, {
        type: RESET_STORE
      })
    ).toEqual(
      Object.assign({}, defaultState, {
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
      })
    );
  });
});
