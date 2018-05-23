const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const { readFile } = require('../util');

let knotsFolder;
if (process.env.NODE_ENV === 'production') {
  // Knots stored on user's home path on packaged app
  knotsFolder = app.getPath('home');
} else {
  // Use the repo during development
  knotsFolder = path.resolve(__dirname, '../../../..', 'knots');
}

const getKnots = () =>
  new Promise((resolve, reject) => {
    try {
      // Get all files and folders in the knots folder
      const knots = fs.readdirSync(knotsFolder);

      // TODO filter out non folders

      // For each folder get the knot.json file
      const knotJsons = knots.map((knot) =>
        readFile(`${knotsFolder}/${knot}/knot.json`)
      );

      Promise.all(knotJsons)
        .then((values) => {
          resolve(values);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });

const detectDocker = () =>
  new Promise((resolve, reject) => {
    // Run `docker -v` on the user's shell
    const docker = spawn('docker', ['-v']);

    // A version number was returned, docker is installed
    docker.stdout.on('data', (version) => {
      resolve(version.toString('utf8'));
    });

    // Threw error, no Docker
    docker.on('error', (error) => {
      reject(error);
    });
  });

module.exports = { detectDocker, getKnots };
