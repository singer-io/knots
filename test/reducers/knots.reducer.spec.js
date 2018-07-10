import knotReducer, { defaultState } from '../../app/reducers/knots';
import * as knotActions from '../../app/actions/knots';

describe('knots reducer', () => {
  it('should return the initial state', () => {
    expect(knotReducer(undefined, {})).toEqual(defaultState);
  });

  it('should handle DETECTING_DOCKER', () => {
    expect(
      knotReducer(undefined, {
        type: knotActions.DETECTING_DOCKER
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        detectingDocker: true
      })
    );
  });
});
