const { taps } = require('../constants');

const getTaps = () =>
  new Promise((resolve, reject) => {
    if (taps) {
      resolve(taps);
    } else {
      reject(new Error('No taps available'));
    }
  });

module.exports = { getTaps };
