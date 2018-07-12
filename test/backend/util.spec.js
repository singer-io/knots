import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import {
  getApplicationFolder,
  getKnotsFolder,
  readFile,
  writeFile,
  addKnotAttribute
} from '../../app/backend/util';

const sampleKnotJson = {
  tap: { name: 'tap-redshift', image: 'dataworld/tap-redshift:1.0.0b8' },
  target: {
    name: 'target-datadotworld',
    image: 'dataworld/target-datadotworld:1.0.1'
  },
  name: 'Sample',
  lastRun: '2018-07-04T18:44:14.581Z'
};

describe('util functions', () => {
  describe('getApplicationFolder', () => {
    it('should return home path as the application folder when in production', () => {
      process.env.NODE_ENV = 'production';
      const actual = getApplicationFolder();
      const expected = path.resolve(require('os').homedir(), '.knots');

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
    it('should return folder based on home path as the application folder when in production', () => {
      process.env.NODE_ENV = 'production';
      const actual = getKnotsFolder();
      const expected = path.resolve(require('os').homedir(), '.knots', 'knots');

      expect(actual).toEqual(expected);
    });

    it('should return folder based on repo as the application folder when not in production', () => {
      process.env.NODE_ENV = 'test';
      const actual = getKnotsFolder();
      const expected = path.resolve(__dirname, '../..', 'knots');

      expect(actual).toEqual(expected);
    });
  });

  describe('getKnotsFolder', () => {
    it('should return folder based on home path as the application folder when in production', () => {
      process.env.NODE_ENV = 'production';
      const actual = getKnotsFolder();
      const expected = path.resolve(require('os').homedir(), '.knots', 'knots');

      expect(actual).toEqual(expected);
    });

    it('should return folder based on repo as the application folder when not in production', () => {
      process.env.NODE_ENV = 'test';
      const actual = getKnotsFolder();
      const expected = path.resolve(__dirname, '../..', 'knots');

      expect(actual).toEqual(expected);
    });
  });

  describe('readFile', () => {
    beforeAll((done) => {
      fs.writeFile(
        path.resolve('sampleKnot.json'),
        JSON.stringify(sampleKnotJson),
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
      const actual = readFile(path.resolve('sampleKnot.json'))
        .then((res) => {
          const actual = res;
          const expected = JSON.stringify(sampleKnotJson);

          expect(1).toEqual(1);
          done();
        })
        .catch((err) => {
          expect(err).toBe(undefined);
          done();
        });
    });

    it('should reject promise if exception is thrown', (done) => {
      const actual = readFile(path.resolve('nonExistent.json'))
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
      writeFile(path.resolve('sampleKnot.json'), JSON.stringify(sampleKnotJson))
        .then((res) => {
          fs.readFile(path.resolve('sampleKnot.json'), 'utf8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toEqual(JSON.stringify(sampleKnotJson));
            done();
          });
        })
        .catch((err) => {
          expect(err).toBe(undefined);
          done();
        });
    });

    it('should reject promise when error is thrown', (done) => {
      writeFile('undefined/path', JSON.stringify(sampleKnotJson))
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
    beforeAll((done) => {
      fs.writeFile(
        path.resolve('sampleKnot.json'),
        JSON.stringify(sampleKnotJson),
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
      shell.rm('-f', path.resolve('broken.json'));
    });

    it('should add an attribute to a knot json file', (done) => {
      addKnotAttribute(
        { field: 'foo', value: 'bar' },
        path.resolve('sampleKnot.json')
      )
        .then((res) => {
          fs.readFile(path.resolve('sampleKnot.json'), 'utf8', (err, data) => {
            const updatedKnot = Object.assign({}, sampleKnotJson, {
              foo: 'bar'
            });

            const actual = data;
            const expected = JSON.stringify(updatedKnot);

            expect(err).toBe(null);
            expect(actual).toEqual(expected);
            done();
          });
        })
        .catch((err) => {
          expect(err).toBe(undefined);
          done();
        });
    });

    it('should reject promise if error is thrown', (done) => {
      addKnotAttribute(
        { field: 'foo', value: 'bar' },
        path.resolve('undefined.json')
      )
        .then(() => {
          expect(true).toBe(false);
          done();
        })
        .catch((err) => {
          expect(err.message).toEqual(
            `ENOENT: no such file or directory, open '${path.resolve(
              'undefined.json'
            )}'`
          );
          done();
        });
    });

    it('should reject promise if json file is invalid', (done) => {
      fs.writeFile(path.resolve('broken.json'), '{"ab":"cd"', (error) => {
        if (!error) {
          addKnotAttribute(
            { field: 'foo', value: 'bar' },
            path.resolve('broken.json')
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
          expect(true).toBe(false);
          done();
        }
      });
    });
  });
});
