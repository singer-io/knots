import path from 'path';
import fs from 'fs';
import shell from 'shelljs';

import {
  getKnots,
  loadKnot,
  loadValues,
  saveKnot,
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
  seedTempKnot,
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
          done();
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
          expect(err).toBeUndefined();
        });
    });

    it('should reject promise when there is an invalid knot', (done) => {
      process.env.NODE_ENV = 'test';
      shell.mkdir('-p', path.resolve('knotsTestFolder', 'sample 3'));
      fs.writeFile(
        path.resolve('knotsTestFolder', 'sample 3', 'knot.json'),
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
      shell.mkdir('-p', path.resolve('tmp', 'cancelUUID', 'knot', 'tap'));
      shell.mkdir('-p', path.resolve('tmp', 'cancelUUID', 'knot', 'target'));
      done();
    });

    afterAll(() => {
      cleanfs();
    });

    it('should delete the temporary knot', () => {
      cancel('cancelUUID')
        .then(() => {
          const getDirectories = (source) =>
            fs
              .readdirSync(source)
              // Get all files and folders in knots directory
              .map((name) => path.join(source, name))
              // Get folder name from absolute path
              .map((folderPath) => path.basename(folderPath));

          // Array of knot names
          const knots = getDirectories(path.resolve('tmp', 'cancelUUID'));

          expect(knots.length).toEqual(0);
        })
        .catch((err) => {
          expect(err).toBeUndefined();
        });
    });
  });

  describe('load knot', () => {
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

    it('should load knot.json values of a saved knot', (done) => {
      const uuid = Math.random().toString();
      loadKnot('savedKnot', uuid)
        .then((res) => {
          expect(res.tap).toEqual(sampleSavedKnot.knotJson.tap);
          expect(res.target).toEqual(sampleSavedKnot.knotJson.target);

          done();
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });

    it('should reject promise when there is an invalid file', (done) => {
      const uuid = Math.random().toString();
      loadKnot('invalidSavedKnot', uuid)
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
      const uuid = Math.random().toString();
      loadValues('savedKnot', uuid)
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
      const uuid = Math.random().toString();
      loadValues('invalidSavedKnot', uuid)
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

  describe('save knot', () => {
    beforeEach((done) => {
      seedTempKnot()
        .then(() => {
          seedKnot()
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

    it('should save specified knot inside knots folder', (done) => {
      saveKnot('knotName', 'tempUUID')
        .then(() => {
          fs.access(
            path.resolve('knotsTestFolder', 'knotName'),
            fs.constants.F_OK,
            (err) => {
              expect(err).toBeNull();
              done();
            }
          );
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });

    it('should delete edited knot', (done) => {
      saveKnot('knotName', 'tempUUID', 'savedKnot')
        .then(() => {
          fs.access(
            path.resolve('knotsTestFolder', 'savedKnot'),
            fs.constants.F_OK,
            (err) => {
              expect(err).toBeDefined();
              done();
            }
          );
        })
        .catch((err) => {
          expect(err).toBeUndefined();
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
            path.resolve('knotsTestFolder', 'savedKnot', 'knot.json'),
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
