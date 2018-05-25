const { targets } = require('./constants');
const { addKnotAttribute } = require('./util');

const getTargets = () =>
  new Promise((resolve, reject) => {
    if (targets) {
      resolve(targets);
    } else {
      reject(new Error('No targets available'));
    }
  });

const addTarget = (target) =>
  new Promise((resolve, reject) => {
    addKnotAttribute({ field: ['target'], value: target })
      .then(resolve)
      .catch(reject);
  });

module.exports = { getTargets, addTarget };
