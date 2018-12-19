import path from 'path';
import fs from 'fs';
import shell from 'shelljs';

import {
  seedKnots,
  seedTapCatalog,
  seedTapConfig,
  sampleTapCatalog,
  sampleTapConfig,
  cleanfs
} from '../util';
import {
  createKnot,
  readSchema,
  addConfig,
  getTaps,
  writeSchema
} from '../../app/backend/taps';
import { taps } from '../../app/backend/constants';

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

    it('should update saved knot', (done) => {
      const uuid = Math.random().toString();
      shell.mkdir('-p', path.resolve('tmp', uuid, 'knot'));

      fs.writeFile(
        path.resolve('tmp', uuid, 'knot', 'knot.json'),
        JSON.stringify({}),
        (err) => {
          if (!err) {
            createKnot(
              {
                name: 'new-tap',
                image: 'new-tap-image',
                specImplementation: {}
              },
              uuid,
              true
            )
              .then(() => {
                fs.readFile(
                  path.resolve('tmp', uuid, 'knot', 'knot.json'),
                  'utf8',
                  (er, data) => {
                    if (!er) {
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
              .catch((e) => {
                expect(e).toBeUndefined();
                done();
              });
          } else {
            expect(err).toBeUndefined();
            done();
          }
        }
      );
    });

    it('should create a new knot json in a temp folder', (done) => {
      const uuid = Math.random().toString();
      createKnot(
        {
          name: 'new-tap',
          image: 'new-tap-image',
          specImplementation: {}
        },
        uuid
      )
        .then(() => {
          fs.readFile(
            path.resolve('tmp', uuid, 'knot', 'knot.json'),
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

  describe('read schema', () => {
    beforeAll((done) => {
      seedTapCatalog()
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
      readSchema('uuid')
        .then((res) => {
          expect(res).toEqual(sampleTapCatalog);
          done();
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });
  });

  describe('add config', () => {
    beforeAll((done) => {
      seedTapConfig()
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

    it("should save a temp knot's tap config", (done) => {
      addConfig({
        body: {
          tapConfig: sampleTapConfig,
          skipDiscovery: false,
          uuid: 'configUUID',
          usesLogBaseRepMethod: false
        }
      })
        .then(() => {
          fs.readFile(
            path.resolve('tmp', 'configUUID', 'knot', 'tap', 'config.json'),
            (err, data) => {
              if (!err) {
                const actual = data.toString();
                const expected = JSON.stringify(sampleTapConfig);
                expect(actual).toEqual(expected);
                done();
              } else {
                expect(err).toBeUndefined();
                done();
              }
            }
          );
        })
        .catch((err) => {
          expect(err).toBeUndefined();
          done();
        });
    });

    it('should return empty object when skipDiscovery is defined', (done) => {
      addConfig({
        body: {
          tapConfig: Object.assign({}, sampleTapConfig, {
            skipDiscovery: true
          }),
          skipDiscovery: true,
          uuid: 'configUUID'
        }
      })
        .then((res) => {
          fs.readFile(
            path.resolve('tmp', 'configUUID', 'knot', 'tap', 'config.json'),
            (err, data) => {
              if (!err) {
                const actual = data.toString();
                const expected = JSON.stringify(
                  Object.assign({}, sampleTapConfig, {
                    skipDiscovery: true
                  })
                );
                expect(actual).toEqual(expected);
                expect(res).toEqual({});
                done();
              } else {
                expect(err).toBeUndefined();
                done();
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

  describe('get taps', () => {
    it('should return a list of available taps', () => {
      getTaps()
        .then((res) => {
          expect(res).toEqual(taps);
        })
        .catch((err) => {
          expect(err).toBeUndefined();
        });
    });
  });

  describe('write schema', () => {
    afterAll(() => {
      cleanfs();
    });

    it('should write tap catalog to file', (done) => {
      const uuid = Math.random().toString();
      writeSchema(sampleTapCatalog, uuid)
        .then(() => {
          fs.readFile(
            path.resolve('tmp', uuid, 'knot', 'tap', 'catalog.json'),
            (err, data) => {
              if (!err) {
                const actual = data.toString();
                const expected = JSON.stringify(sampleTapCatalog);
                expect(actual).toEqual(expected);
                done();
              } else {
                expect(err).toBeUndefined();
                done();
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
});
