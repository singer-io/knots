const path = require('path');
const shell = require('shelljs');
const { app } = require('electron');

const { targets } = require('./constants');
const { addKnotAttribute, writeFile } = require('./util');

let applicationFolder;
if (process.env.NODE_ENV === 'production') {
  applicationFolder = path.resolve(app.getPath('home'), 'knot');
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

const addTarget = (target) =>
  new Promise((resolve, reject) => {
    addKnotAttribute({ field: ['target'], value: target })
      .then(resolve)
      .catch(reject);
  });

const addTargetConfig = (config) =>
  new Promise((resolve, reject) => {
    writeFile(
      path.resolve(applicationFolder, 'config.json'),
      JSON.stringify(config)
    )
      .then(() => {
        shell.rm('-fr', path.resolve(applicationFolder, 'configs', 'target'));
        shell.mkdir('-p', path.resolve(applicationFolder, 'configs', 'target'));
        shell.mv(
          path.resolve(applicationFolder, 'config.json'),
          path.resolve(applicationFolder, 'configs', 'target')
        );
        resolve();
      })
      .catch(reject);
  });

module.exports = { getTargets, addTarget, addTargetConfig };
