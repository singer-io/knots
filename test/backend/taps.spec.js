import path from 'path';
import fs from 'fs';
import mockSpawn from 'mock-spawn';

import {
  seedKnots,
  seedCatalog,
  sampleKnotJsons,
  sampleCatalog,
  savedSampleCatalog,
  cleanfs
} from '../util';
import { createKnot, getSchema, readSchema } from '../../app/backend/taps';

const mySpawn = mockSpawn();

describe('taps functions', () => {
  describe('create knot', () => {
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

    it('should update knot at passed path', (done) => {
      createKnot(
        {
          name: 'new-tap',
          image: 'new-tap-image',
          specImplementation: {}
        },
        path.resolve('knots', 'sample 1', 'knot.json')
      )
        .then(() => {
          fs.readFile(
            path.resolve('knots', 'sample 1', 'knot.json'),
            'utf8',
            (err, data) => {
              if (!err) {
                try {
                  const actual = JSON.parse(data);
                  const expected = Object.assign({}, sampleKnotJsons[0], {
                    tap: {
                      name: 'new-tap',
                      image: 'new-tap-image',
                      specImplementation: {}
                    }
                  });

                  expect(actual).toEqual(expected);
                  done();
                } catch (error) {
                  expect(error).toBeUndefined();
                  done();
                }
              }
            }
          );
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });

    it('should create a new knot json in a temp folder', (done) => {
      createKnot({
        name: 'new-tap',
        image: 'new-tap-image',
        specImplementation: {}
      })
        .then(() => {
          fs.readFile(
            path.resolve('tmp', 'knot', 'knot.json'),
            'utf8',
            (err, data) => {
              if (!err) {
                try {
                  const actual = JSON.parse(data);
                  const expected = {
                    tap: {
                      name: 'new-tap',
                      image: 'new-tap-image',
                      specImplementation: {}
                    }
                  };

                  expect(actual).toEqual(expected);
                  done();
                } catch (error) {
                  expect(error).toBeUndefined();
                  done();
                }
              }
            }
          );
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });
  });

  describe('get schema', () => {
    it('should resolve when there is no error', () => {
      mySpawn.setDefault(mySpawn.simple(0, ''));
      getSchema(
        {
          body: {
            tap: { name: 'tap-adwords', image: 'dataworld/tap-adwords:1.3.3' }
          }
        },
        mySpawn
      )
        .then(() => {
          expect(true).toBe(true);
        })
        .catch((err) => {
          expect(err).toBeUndefined();
        });
    });

    it('should reject promise when there is an error', () => {
      mySpawn.setDefault(mySpawn.simple(1, 'Error'));
      getSchema(
        {
          body: {
            tap: { name: 'tap-adwords', image: 'dataworld/tap-adwords:1.3.3' }
          }
        },
        mySpawn
      )
        .then(() => {
          expect(true).toBe(false);
        })
        .catch((err) => {
          expect(err).toBeDefined();
        });
    });
  });

  describe('read schema', () => {
    beforeAll((done) => {
      seedCatalog()
        .then(() => {
          done();
        })
        .catch((error) => {
          expect(error).toBeUndefined();
          done();
        });
    });

    afterAll(() => {
      cleanfs();
    });

    it('should read a temporary knot schema', (done) => {
      readSchema()
        .then((res) => {
          expect(res).toEqual(sampleCatalog);
          done();
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });

    it('should read a saved knot schema', (done) => {
      readSchema('savedKnot')
        .then((res) => {
          expect(res).toEqual(savedSampleCatalog);
          done();
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });

    it('should reject promise for invalid jsons', (done) => {
      readSchema('invalidKnot')
        .then(() => {
          expect(true).toBe(false);
          done();
        })
        .catch((err) => {
          expect(err).toBeDefined();
          done();
        });
    });
  });
});
