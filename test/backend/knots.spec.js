import path from 'path';
import fs from 'fs';
import shell from 'shelljs';

import { getKnots, invalidKnotString } from '../../app/backend/knots';

import { sampleKnotJsons, seedKnots, cleanfs } from '../util';

describe('knots functions', () => {
  describe('get knots', () => {
    beforeAll((done) => {
      seedKnots()
        .then(() => {
          done();
        })
        .catch((error) => {
          expect(error).toBeUndefined();
        });
    });

    afterAll(() => {
      cleanfs();
    });

    it('should return an array of knot jsons', () => {
      getKnots()
        .then((knotObjects) => {
          expect(knotObjects.length).toEqual(2);
          expect(JSON.stringify(knotObjects[0])).toEqual(
            JSON.stringify(sampleKnotJsons[0])
          );
          expect(JSON.stringify(knotObjects[1])).toEqual(
            JSON.stringify(sampleKnotJsons[1])
          );
        })
        .catch((err) => {
          expect(err).toBe(null);
        });
    });

    it('should reject promise when exception is thrown', () => {
      process.env.NODE_ENV = 'production';
      getKnots()
        .then(() => {
          expect(true).toBe(false);
        })
        .catch((err) => {
          expect(err).toBeDefined();
        });
    });

    it('should reject promise when there is an ivalid knot', (done) => {
      process.env.NODE_ENV = 'test';
      shell.mkdir('-p', path.resolve('knots', 'sample 3'));
      fs.writeFile(
        path.resolve('knots', 'sample 3', 'knot.json'),
        invalidKnotString,
        (err) => {
          if (!err) {
            getKnots()
              .then(() => {
                expect(true).toBe(false);
              })
              .catch((error) => {
                expect(error).toBeDefined();
                done();
              });
          } else {
            expect(true).toBe(false);
            done();
          }
        }
      );
    });
  });
});
