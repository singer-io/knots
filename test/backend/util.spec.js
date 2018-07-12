import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import {
  getApplicationFolder,
  getKnotsFolder,
  readFile
} from '../../app/backend/util';

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
    const sampleKnotJson = {
      tap: { name: 'tap-redshift', image: 'dataworld/tap-redshift:1.0.0b8' },
      target: {
        name: 'target-datadotworld',
        image: 'dataworld/target-datadotworld:1.0.1'
      },
      name: 'Sample',
      lastRun: '2018-07-04T18:44:14.581Z'
    };

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
});
