import path from 'path';
import mockfs from 'mock-fs';
import { getApplicationFolder, getKnotsFolder } from '../../app/backend/util';

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
});
