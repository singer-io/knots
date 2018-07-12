import mockSpawn from 'mock-spawn';
import { dockerInstalled, dockerRunning } from '../../app/backend/docker';

const mySpawn = mockSpawn();

describe('docker commands', () => {
  it('should return Docker version number if installed', () => {
    mySpawn.setDefault(
      mySpawn.simple(0, 'Docker version 18.03.1-ce, build 9ee9f40')
    );
    dockerInstalled(mySpawn)
      .then((res) => {
        expect(res).toEqual('Docker version 18.03.1-ce, build 9ee9f40');
      })
      .catch((err) => {
        expect(err).toBe(undefined);
      });
  });

  it('should reject promise if Docker is not installed', () => {
    mySpawn.setDefault(mySpawn.simple(1));
    dockerInstalled(mySpawn)
      .then((res) => {
        expect(res).toBe(undefined);
      })
      .catch((err) => {
        expect(err).toEqual(new Error('Unable to run Docker'));
      });
  });

  it('should resolve promise if Docker is running', () => {
    mySpawn.setDefault(mySpawn.simple(0, 'DRIVER              VOLUME NAME'));
    dockerRunning(mySpawn)
      .then((res) => {
        expect(res).toEqual('DRIVER              VOLUME NAME');
      })
      .catch((err) => {
        expect(err).toBe(undefined);
      });
  });

  it('should reject promise if Docker is not running', () => {
    mySpawn.setDefault(mySpawn.simple(1));
    dockerRunning(mySpawn)
      .then((res) => {
        expect(res).toBe(undefined);
      })
      .catch((err) => {
        expect(err).toEqual(new Error('Unable to get Docker volumes'));
      });
  });
});
