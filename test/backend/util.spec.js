import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import os from 'os';

import {
  getApplicationFolder,
  getKnotsFolder,
  createTemporaryKnotFolder,
  getTemporaryKnotFolder,
  readFile,
  writeFile,
  addKnotAttribute,
  createMakeFileCommands
} from '../../app/backend/util';
import { sampleKnotJsons, cleanfs } from '../util';

describe('util functions', () => {
  afterAll(() => {
    cleanfs();
  });

  describe('getApplicationFolder', () => {
    it('should return home path as the application folder when in production', () => {
      process.env.NODE_ENV = 'production';
      const actual = getApplicationFolder();
      const expected = path.resolve(os.homedir(), '.knots');

      expect(actual).toEqual(expected);
    });

    it('should return repo as the application folder when not in production', () => {
      process.env.NODE_ENV = 'test';
      const actual = getApplicationFolder();
      const expected = path.resolve(__dirname, '../..');

      expect(actual).toEqual(expected);
    });
  });

  describe('getKnotsFolder', () => {
    it('should return folder based on home path when in production', () => {
      process.env.NODE_ENV = 'production';
      const actual = getKnotsFolder();
      const expected = path.resolve(os.homedir(), '.knots', 'knots');

      expect(actual).toEqual(expected);
    });

    it('should return folder based on repo when not in production', () => {
      process.env.NODE_ENV = 'test';
      const actual = getKnotsFolder();
      const expected = path.resolve(__dirname, '../..', 'knotsTestFolder');

      expect(actual).toEqual(expected);
    });
  });

  describe('createTemporaryKnotFolder', () => {
    it('creates a temporary knots folder in production', () => {
      process.env.NODE_ENV = 'production';
      createTemporaryKnotFolder('prodUUID');

      const tempFolderPath = path.resolve(
        os.homedir(),
        '.knots',
        'tmp',
        'prodUUID',
        'knot'
      );

      fs.readdir(tempFolderPath, (err) => {
        if (err) {
          expect(err).toBeUndefined();
        }

        try {
          const tapFolderCreated = fs
            .lstatSync(path.resolve(tempFolderPath, 'tap'))
            .isDirectory();

          const targetFolderCreated = fs
            .lstatSync(path.resolve(tempFolderPath, 'target'))
            .isDirectory();

          expect(tapFolderCreated).toBe(true);
          expect(targetFolderCreated).toBe(true);
        } catch (error) {
          expect(error).toBeUndefined();
        }
      });
    });

    it('creates a temporary knots folder when not in production', () => {
      process.env.NODE_ENV = 'test';
      createTemporaryKnotFolder('devUUID');

      const tempFolderPath = path.resolve('tmp', 'devUUID', 'knot');

      fs.readdir(tempFolderPath, (err) => {
        if (err) {
          expect(err).toBeUndefined();
        }

        try {
          const tapFolderCreated = fs
            .lstatSync(path.resolve(tempFolderPath, 'tap'))
            .isDirectory();

          const targetFolderCreated = fs
            .lstatSync(path.resolve(tempFolderPath, 'target'))
            .isDirectory();

          expect(tapFolderCreated).toBe(true);
          expect(targetFolderCreated).toBe(true);
        } catch (error) {
          expect(error).toBeUndefined();
        }
      });
    });
  });

  describe('getTemporaryKnotsFolder', () => {
    it('should return folder based on home path when in production', () => {
      process.env.NODE_ENV = 'production';
      const uuid = Math.random().toString();
      const actual = getTemporaryKnotFolder(uuid);
      const expected = path.resolve(
        os.homedir(),
        '.knots',
        'tmp',
        uuid,
        'knot'
      );

      expect(actual).toEqual(expected);
    });

    it('should return folder based on repo when not in production', () => {
      process.env.NODE_ENV = 'test';
      const uuid = Math.random().toString();
      const actual = getTemporaryKnotFolder(uuid);
      const expected = path.resolve(__dirname, '../..', 'tmp', uuid, 'knot');

      expect(actual).toEqual(expected);
    });
  });

  describe('readFile', () => {
    beforeAll((done) => {
      fs.writeFile(
        path.resolve('sampleKnot.json'),
        JSON.stringify(sampleKnotJsons[0]),
        (error) => {
          if (!error) {
            done();
          } else {
            expect(true).toBe(false);
            done();
          }
        }
      );
    });

    afterAll(() => {
      shell.rm('-f', path.resolve('sampleKnot.json'));
    });

    it('should return the contents of a file', (done) => {
      readFile(path.resolve('sampleKnot.json'))
        .then((res) => {
          const actual = res;
          const expected = JSON.stringify(sampleKnotJsons[0]);

          expect(actual).toEqual(expected);
          done();
        })
        .catch((err) => {
          expect(err).toBe(undefined);
          done();
        });
    });

    it('should reject promise if exception is thrown', (done) => {
      readFile(path.resolve('nonExistent.json'))
        .then((res) => {
          expect(res).toBe(undefined);
          done();
        })
        .catch((err) => {
          expect(err.message).toEqual(
            `ENOENT: no such file or directory, open '${path.resolve(
              'nonExistent.json'
            )}'`
          );
          done();
        });
    });
  });

  describe('writeFile', () => {
    afterAll(() => {
      shell.rm('-f', path.resolve('sampleKnot.json'));
    });

    it('should write passed contents to file', (done) => {
      writeFile(
        path.resolve('sampleKnot.json'),
        JSON.stringify(sampleKnotJsons[0])
      )
        .then(() => {
          fs.readFile(path.resolve('sampleKnot.json'), 'utf8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toEqual(JSON.stringify(sampleKnotJsons[0]));
            done();
          });
        })
        .catch((err) => {
          expect(err).toBe(undefined);
          done();
        });
    });

    it('should reject promise when error is thrown', (done) => {
      writeFile('undefined/path', JSON.stringify(sampleKnotJsons[0]))
        .then()
        .catch((err) => {
          expect(err.message).toEqual(
            "ENOENT: no such file or directory, open 'undefined/path'"
          );
          done();
        });
    });
  });

  describe('addKnotAttribute', () => {
    beforeEach((done) => {
      shell.mkdir('-p', path.resolve('tmp', 'knotUUID', 'knot'));
      fs.writeFile(
        path.resolve('tmp', 'knotUUID', 'knot', 'knot.json'),
        JSON.stringify({}),
        (error) => {
          if (!error) {
            done();
          } else {
            expect(error).toBeUndefined();
            done();
          }
        }
      );
    });

    afterEach(() => {
      shell.rm('-f', path.resolve('sampleKnot.json'));
      shell.rm('-f', path.resolve('broken.json'));
      cleanfs();
    });

    it('should add an attribute to a knot json file', (done) => {
      addKnotAttribute(
        { field: 'foo', value: 'bar' },
        path.resolve('tmp', 'knotUUID', 'knot', 'knot.json')
      )
        .then(() => {
          fs.readFile(
            path.resolve('tmp', 'knotUUID', 'knot', 'knot.json'),
            'utf8',
            (err, data) => {
              const updatedKnot = {
                foo: 'bar'
              };

              const actual = data;
              const expected = JSON.stringify(updatedKnot);

              expect(err).toBe(null);
              expect(actual).toEqual(expected);
              done();
            }
          );
        })
        .catch((err) => {
          expect(err).toBe(undefined);
          done();
        });
    });

    it('should reject promise if json file is invalid', (done) => {
      shell.mkdir('-p', path.resolve('tmp', 'brokenKnotUUID', 'knot'));
      fs.writeFile(
        path.resolve('tmp', 'brokenKnotUUID', 'knot', 'knot.json'),
        '{"ab":"cd"',
        (error) => {
          if (!error) {
            addKnotAttribute(
              { field: 'foo', value: 'bar' },
              null,
              'brokenKnotUUID'
            )
              .then(() => {
                expect(true).toBe(false);
                done();
              })
              .catch((err) => {
                expect(err.message).toEqual('Unexpected end of JSON input');
                done();
              });
          } else {
            expect(error).toBeUndefined();
            done();
          }
        }
      );
    });
  });

  describe('createMakefileCommands', () => {
    it('should create valid makefile commands for taps with catalog command', () => {
      /* eslint-disable no-tabs */
      const expected = `SHELL=/bin/bash -o pipefail\n\nfullSync:${
        os.EOL
      }\t-\tdocker run -v "$(CURDIR)/tap:/app/tap/data" --interactive ${'dataworld/tap-redshift:1.0.0b8'} ${'tap-redshift'} -c tap/data/config.json --catalog tap/data/catalog.json | docker run -v "$(CURDIR)/target:/app/target/data" --interactive ${'dataworld/target-datadotworld:1.0.1'} ${'target-datadotworld'} -c target/data/config.json > ./tap/state.json${
        os.EOL
      }sync:${
        os.EOL
      }\tif [ ! -f ./tap/latest-state.json ]; then touch ./tap/latest-state.json; fi${
        os.EOL
      }\ttail -1 "$(CURDIR)/tap/state.json" > "$(CURDIR)/tap/latest-state.json"; \\${
        os.EOL
      }\tdocker run -v "$(CURDIR)/tap:/app/tap/data" --interactive ${'dataworld/tap-redshift:1.0.0b8'} ${'tap-redshift'} -c tap/data/config.json --catalog tap/data/catalog.json --state tap/data/latest-state.json | docker run -v "$(CURDIR)/target:/app/target/data" --interactive ${'dataworld/target-datadotworld:1.0.1'} ${'target-datadotworld'} -c target/data/config.json > ./tap/state.json`;

      const actual = createMakeFileCommands({
        tap: {
          name: 'tap-redshift',
          image: 'dataworld/tap-redshift:1.0.0b8',
          specImplementation: {}
        },
        target: {
          name: 'target-datadotworld',
          image: 'dataworld/target-datadotworld:1.0.1'
        }
      });

      expect(actual).toEqual(expected);
    });

    it('should create valid makefile commands for taps with properties command', () => {
      /* eslint-disable no-tabs */
      const expected = `SHELL=/bin/bash -o pipefail\n\nfullSync:${
        os.EOL
      }\t-\tdocker run -v "$(CURDIR)/tap:/app/tap/data" --interactive ${'dataworld/tap-facebook:1.5.1'} ${'tap-facebook'} -c tap/data/config.json --properties tap/data/catalog.json | docker run -v "$(CURDIR)/target:/app/target/data" --interactive ${'dataworld/target-datadotworld:1.0.1'} ${'target-datadotworld'} -c target/data/config.json > ./tap/state.json${
        os.EOL
      }sync:${
        os.EOL
      }\tif [ ! -f ./tap/latest-state.json ]; then touch ./tap/latest-state.json; fi${
        os.EOL
      }\ttail -1 "$(CURDIR)/tap/state.json" > "$(CURDIR)/tap/latest-state.json"; \\${
        os.EOL
      }\tdocker run -v "$(CURDIR)/tap:/app/tap/data" --interactive ${'dataworld/tap-facebook:1.5.1'} ${'tap-facebook'} -c tap/data/config.json --properties tap/data/catalog.json --state tap/data/latest-state.json | docker run -v "$(CURDIR)/target:/app/target/data" --interactive ${'dataworld/target-datadotworld:1.0.1'} ${'target-datadotworld'} -c target/data/config.json > ./tap/state.json`;

      const actual = createMakeFileCommands({
        tap: {
          name: 'tap-facebook',
          image: 'dataworld/tap-facebook:1.5.1',
          specImplementation: {
            usesCatalogArg: false
          }
        },
        target: {
          name: 'target-datadotworld',
          image: 'dataworld/target-datadotworld:1.0.1'
        }
      });

      expect(actual).toEqual(expected);
    });
  });
});
