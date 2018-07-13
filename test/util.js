import path from 'path';
import fs from 'fs';
import shell from 'shelljs';

const sampleKnotJson1 = {
  tap: { name: 'tap-redshift', image: 'dataworld/tap-redshift:1.0.0b8' },
  target: {
    name: 'target-datadotworld',
    image: 'dataworld/target-datadotworld:1.0.1'
  },
  name: 'Redshift-Datadotworld',
  lastRun: '2018-07-13T12:30:03.380Z'
};

const sampleKnotJson2 = {
  tap: { name: 'tap-salesforce', image: 'dataworld/tap-salesforce:1.4.14' },
  target: {
    name: 'target-stitch',
    image: 'dataworld/target-stitch:1.7.4'
  },
  name: 'Salesforce-Stitch',
  lastRun: '2018-07-13T12:30:20.114Z'
};

export const invalidKnotString =
  '{"tap":{"name":"tap-salesforce","image":"dataworld/tap-salesforce:1.4.14"},"target":{"name":"target-stitch","image":"dataworld/target-stitch:1.7.4"},"name":"Salesforce-Stitch","lastRun":"2018-07-13T12:30:20.114Z"';

export const sampleKnotJsons = [sampleKnotJson1, sampleKnotJson2];

export const seedKnots = () =>
  new Promise((resolve, reject) => {
    const sampleKnotNames = ['sample 1', 'sample 2'];

    shell.mkdir('-p', path.resolve('knots'));

    sampleKnotNames.forEach((knot) => {
      shell.mkdir('-p', path.resolve('knots', knot));
    });

    fs.writeFile(
      path.resolve('knots', 'sample 1', 'knot.json'),
      JSON.stringify(sampleKnotJsons[0]),
      (error) => {
        if (!error) {
          fs.writeFile(
            path.resolve('knots', 'sample 2', 'knot.json'),
            JSON.stringify(sampleKnotJsons[1]),
            (err) => {
              if (!err) {
                resolve();
              } else {
                reject(error);
              }
            }
          );
        } else {
          reject(error);
        }
      }
    );
  });

export const cleanfs = () => {
  shell.rm('-rf', path.resolve('knots'));
  shell.rm('-rf', path.resolve('tmp'));
};
