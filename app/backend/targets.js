const path = require('path');
const shell = require('shelljs');
const { app } = require('electron');

const { targets } = require('./constants');
const { addKnotAttribute, writeFile } = require('./util');

let applicationFolder;
if (process.env.NODE_ENV === 'production') {
  applicationFolder = path.resolve(app.getPath('home'), 'knots');
} else {
  applicationFolder = path.resolve(__dirname, '../../');
}

const getTargets = () =>
  new Promise((resolve, reject) => {
    if (targets) {
      resolve(targets);
    } else {
      reject(new Error('No targets available'));
    }
  });

const addTarget = (target, knot) =>
  new Promise((resolve, reject) => {
    const knotPath = knot
      ? path.resolve(applicationFolder, 'knots', knot, 'knot.json')
      : '';
    addKnotAttribute({ field: ['target'], value: target }, knotPath)
      .then(resolve)
      .catch(reject);
  });

const addTargetConfig = (config, knot) =>
  new Promise((resolve, reject) => {
    const configPath = knot
      ? path.resolve(applicationFolder, 'knots', knot, 'target', 'config.json')
      : path.resolve(applicationFolder, 'config.json');
    writeFile(configPath, JSON.stringify(config))
      .then(() => {
        if (knot) {
          resolve();
        } else {
          shell.rm('-fr', path.resolve(applicationFolder, 'configs', 'target'));
          shell.mkdir(
            '-p',
            path.resolve(applicationFolder, 'configs', 'target')
          );
          shell.mv(
            path.resolve(applicationFolder, 'config.json'),
            path.resolve(applicationFolder, 'configs', 'target')
          );
          resolve();
        }
      })
      .catch(reject);
  });

module.exports = { getTargets, addTarget, addTargetConfig };
