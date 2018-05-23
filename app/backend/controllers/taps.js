const path = require('path');
const { app } = require('electron');
const { writeFile } = require('../util');

const {
  taps,
  tapRedshiftFields,
  tapSalesforceFields
} = require('../constants');

let applicationFolder;
if (process.env.NODE_ENV === 'production') {
  applicationFolder = path.resolve(app.getPath('home'), 'knot');
} else {
  applicationFolder = path.resolve(__dirname, '../../..');
}

const createKnot = (tapName, tapImage) =>
  new Promise((resolve, reject) => {
    writeFile(
      path.resolve(applicationFolder, 'knot.json'),
      JSON.stringify({
        tap: {
          name: tapName,
          image: tapImage
        }
      })
    )
      .then(() => {
        resolve();
      })
      .catch(reject);
  });

const getTaps = () =>
  new Promise((resolve, reject) => {
    if (taps) {
      resolve(taps);
    } else {
      reject(new Error('No taps available'));
    }
  });

const fetchTapFields = (tap, image) =>
  new Promise((resolve, reject) => {
    createKnot(tap, image)
      .then(() => {
        switch (tap) {
          case 'tap-redshift':
            resolve(tapRedshiftFields);
            break;
          case 'tap-salesforce':
            resolve(tapSalesforceFields);
            break;
          default:
            reject(new Error('Unknown tap'));
        }
      })
      .catch(reject);
  });

module.exports = { getTaps, fetchTapFields };
