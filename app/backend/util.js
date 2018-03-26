const fs = require('fs');
const { taps } = require('./constants');

const getKnots = () =>
  new Promise((resolve, reject) => {
    try {
      const knots = fs.readdirSync('./knots');

      resolve(knots);
    } catch (err) {
      reject(err);
    }
  });

const getTaps = () =>
  new Promise((resolve, reject) => {
    console.log('Called');
    if (taps) {
      resolve(taps);
    } else {
      reject();
    }
  });

module.exports = {
  getKnots,
  getTaps
};
