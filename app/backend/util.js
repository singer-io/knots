const fs = require('fs');

const getKnots = () =>
  new Promise((resolve, reject) => {
    try {
      const knots = fs.readdirSync('./knots');

      resolve(knots);
    } catch (err) {
      reject(err);
    }
  });

module.exports = {
  getKnots
};
