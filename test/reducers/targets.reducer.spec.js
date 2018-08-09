import targetReducer, { defaultState } from '../../app/reducers/targets';
import * as targetActions from '../../app/actions/targets';
import { LOADED_KNOT, RESET_STORE } from '../../app/actions/knots';
import { sampleTargets } from '../utils';

describe('target reducer', () => {
  it('should return the initial state', () => {
    expect(targetReducer(undefined, {})).toEqual(defaultState());
  });

  it('should handle TARGETS_LOADING', () => {
    expect(
      targetReducer(undefined, {
        type: targetActions.TARGETS_LOADING
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        targetsLoading: true
      })
    );
  });

  it('should handle UPDATE_TARGETS', () => {
    expect(
      targetReducer(undefined, {
        type: targetActions.UPDATE_TARGETS,
        targets: sampleTargets,
        error: ''
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        targetsLoading: false,
        targets: sampleTargets
      })
    );
  });

  it('should handle TARGET_SELECTED', () => {
    expect(
      targetReducer(undefined, {
        type: targetActions.TARGET_SELECTED,
        target: sampleTargets[0],
        error: ''
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        targetSelected: true,
        selectedTarget: sampleTargets[0]
      })
    );
  });

  it('should handle LOADED_KNOT', () => {
    expect(
      targetReducer(undefined, {
        type: LOADED_KNOT,
        target: sampleTargets[0]
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        selectedTarget: sampleTargets[0]
      })
    );
  });

  it('should handle RESET_STORE', () => {
    expect(
      targetReducer(undefined, {
        type: RESET_STORE
      })
    ).toEqual(Object.assign({}, defaultState()));
  });
});
