import { getTargets } from '../../app/backend/targets';
import { targets } from '../../app/backend/constants';

describe('targets functions', () => {
  describe('get targets', () => {
    it('should return a list of available targets', () => {
      getTargets()
        .then((res) => {
          expect(res).toEqual(targets);
        })
        .catch((err) => {
          expect(err).toBeUndefined();
        });
    });
  });
});
