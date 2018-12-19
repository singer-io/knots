import knotReducer, { defaultState } from '../../app/reducers/knots';
import * as knotActions from '../../app/actions/knots';

describe('knots reducer', () => {
  it('should return the initial state', () => {
    expect(knotReducer(undefined, {})).toEqual(defaultState());
  });

  it('should handle DETECTING_DOCKER', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.DETECTING_DOCKER
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        detectingDocker: true
      })
    );
  });

  it('should handle UPDATE_DOCKER_VERSION', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.UPDATE_DOCKER_VERSION,
        version: '',
        error: false
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        dockerError: false,
        dockerVerified: false
      })
    );
  });

  it('should detect DOCKER_RUNNING', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.DOCKER_RUNNING,
        running: true,
        error: false
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        dockerRunning: true,
        dockerError: false,
        dockerVerified: true
      })
    );
  });

  it('should handle FETCHING_KNOTS', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.FETCHING_KNOTS
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        fetchingKnots: true,
        knotDeleted: false
      })
    );
  });

  it('should handle FETCHED_KNOT', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.FETCHED_KNOT,
        knots: []
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        fetchingKnots: false,
        knots: []
      })
    );
  });

  it('should handle UPDATE_TAP_LOGS', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.UPDATE_TAP_LOGS,
        newLog: 'showing tap logs'
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        tapLogs: ['showing tap logs']
      })
    );
  });

  it('should handle UPDATE_TARGET_LOGS', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.UPDATE_TARGET_LOGS,
        newLog: 'showing target logs'
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        targetLogs: ['showing target logs']
      })
    );
  });

  it('should handle UPDATE_NAME', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.UPDATE_NAME,
        name: 'knotname'
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        knotName: 'knotname'
      })
    );
  });

  it('should handle KNOT_SYNCING', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.KNOT_SYNCING
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        knotSyncing: true,
        knotSynced: false,
        tapLogs: [],
        targetLogs: []
      })
    );
  });

  it('should handle KNOT_SYNCED', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.KNOT_SYNCED
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        knotSyncing: false,
        knotSynced: true
      })
    );
  });

  it('should handle KNOT_DELETED', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.KNOT_DELETED
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        knotDeleted: true
      })
    );
  });

  it('should handle LOADING_KNOT', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.LOADING_KNOT
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        knotLoading: true
      })
    );
  });

  it('should handle LOADED_KNOT', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.LOADED_KNOT,
        knotName: 'knotname',
        usesLogBaseRepMethod: false
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        knotLoading: false,
        knotLoaded: true,
        knotName: 'knotname',
        usesLogBaseRepMethod: false
      })
    );
  });

  it('should handle RESET_STORE', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.RESET_STORE
      })
    ).toEqual(Object.assign({}, defaultState()));
  });

  it('should handle GENERATED_UUID', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.GENERATED_UUID,
        uuid: 'asdfgh'
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        uuid: 'asdfgh'
      })
    );
  });

  it('should handle RESET_KNOT_ERROR', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.RESET_KNOT_ERROR
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        knotError: '',
        knotSyncing: false,
        knotSynced: false
      })
    );
  });

  it('should handle FETCHED_KNOTS', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.FETCHED_KNOTS,
        knots: ['knot1', 'knot2']
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        fetchingKnots: false,
        knots: ['knot1', 'knot2']
      })
    );
  });
});
