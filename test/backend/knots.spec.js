import path from 'path';
import fs from 'fs';
import shell from 'shelljs';

import {
  getKnots,
  loadValues,
  deleteKnot,
  cancel,
  packageKnot
} from '../../app/backend/knots';

import {
  sampleKnotJsons,
  sampleSavedKnot,
  invalidKnotString,
  seedKnots,
  seedKnot,
  seedInvalidKnot,
  cleanfs
} from '../util';

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

    it('should reject promise when there is an invalid knot', (done) => {
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

  describe('cancel', () => {
    beforeAll((done) => {
      shell.mkdir('-p', path.resolve('tmp', 'knot', 'tap'));
      shell.mkdir('-p', path.resolve('tmp', 'knot', 'target'));
      done();
    });

    afterAll(() => {
      cleanfs();
    });

    it('should delete the temporary knot', () => {
      cancel()
        .then(() => {
          const getDirectories = (source) =>
            fs
              .readdirSync(source)
              // Get all files and folders in knots directory
              .map((name) => path.join(source, name))
              // Get folder name from absolute path
              .map((folderPath) => path.basename(folderPath));

          // Array of knot names
          const knots = getDirectories(path.resolve('tmp'));

          expect(knots.length).toEqual(0);
        })
        .catch((err) => {
          expect(err).toBeUndefined();
        });
    });
  });

  describe('load values', () => {
    beforeAll((done) => {
      seedKnot()
        .then(() => {
          seedInvalidKnot()
            .then(() => {
              done();
            })
            .catch((error) => {
              expect(error).toBeUndefined();
              done();
            });
        })
        .catch((error) => {
          expect(error).toBeUndefined();
          done();
        });
    });

    afterAll(() => {
      cleanfs();
    });

    it('should load values of a saved knot', (done) => {
      loadValues('savedKnot')
        .then((res) => {
          expect(res.name).toEqual(sampleSavedKnot.knotJson.name);
          expect(res.tap).toEqual(sampleSavedKnot.knotJson.tap);
          expect(res.target).toEqual(sampleSavedKnot.knotJson.target);
          expect(res.tapConfig).toEqual(sampleSavedKnot.tapConfig);
          expect(res.targetConfig).toEqual(sampleSavedKnot.targetConfig);
          expect(res.schema).toEqual(sampleSavedKnot.tapCatalog.streams);

          done();
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });

    it('should reject promise when there is an invalid file', (done) => {
      loadValues('invalidSavedKnot')
        .then((res) => {
          expect(res).toBeUndefined();
          done();
        })
        .catch((err) => {
          expect(err).toBeDefined();
          done();
        });
    });
  });

  describe('delete knot', () => {
    beforeAll((done) => {
      seedKnot()
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

    it('should delete specified knot', (done) => {
      deleteKnot('savedKnot')
        .then(() => {
          fs.readFile(
            path.resolve('knots', 'savedKnot', 'knot.json'),
            (err) => {
              if (!err) {
                expect(true).toBe(false);
                done();
              } else {
                expect(err).toBeDefined();
                done();
              }
            }
          );

          done();
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });
  });

  describe('package knot', () => {
    beforeAll((done) => {
      seedKnot()
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

    it('should create a zip of the saved knot', (done) => {
      packageKnot('savedKnot')
        .then(() => {
          const pathToZip = path.resolve('tmp', 'savedKnot.zip');
          fs.access(pathToZip, fs.constants.F_OK, (err) => {
            expect(err).toBeFalsy();
            done();
          });
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });

    it('should reject promise when exception is thrown', (done) => {
      packageKnot('undefined')
        .then(() => {
          expect(true).toBe(false);
        })
        .catch((err) => {
          expect(err).toBeDefined();
          done();
        });
    });
  });
});
