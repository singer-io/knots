const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { set } = require('lodash');
const { app } = require('electron');

const { commands } = require('./constants');

let tempFolder;

if (process.env.NODE_ENV === 'production') {
  tempFolder = path.resolve(app.getPath('home'), 'knots');
} else {
  tempFolder = path.resolve(__dirname, '..', '..');
}

let applicationFolder;
if (process.env.NODE_ENV === 'production') {
  applicationFolder = path.resolve(app.getPath('home'), 'knots');
} else {
  applicationFolder = path.resolve(__dirname, '../../');
}

const readFile = (filePath) =>
  new Promise((resolve, reject) => {
    // Return contents of specified file as a string
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (!err) {
        resolve(data);
      }
      reject(err);
    });
  });

const writeFile = (filePath, content) =>
  new Promise((resolve, reject) => {
    // Write the content specified to the specified file
    fs.writeFile(filePath, content, (err) => {
      if (!err) {
        resolve();
      }

      reject();
    });
  });

const addKnotAttribute = (content, passedPath) =>
  new Promise((resolve, reject) => {
    const pathToKnot =
      passedPath || path.resolve(applicationFolder, 'knot.json');
    readFile(pathToKnot)
      .then((knotObjectString) => {
        try {
          // Try to turn to object to validate it's a valid object
          const knotObject = JSON.parse(knotObjectString);

          const newKnot = set(knotObject, content.field, content.value);

          writeFile(pathToKnot, JSON.stringify(newKnot))
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        } catch (error) {
          // Not a valid object, pass on the error
          reject(error);
        }
      })
      .catch(reject);
  });

const partialSync = (req) =>
  new Promise((resolve, reject) => {
    const { knotName } = req.body;

    // Get the stored knot object
    readFile(path.resolve(`${tempFolder}/knots/${knotName}`, 'knot.json'))
      .then((knotObject) => {
        // Get tap and target from the knot object
        const syncData = exec(
          commands.runPartialSync(
            `${tempFolder}/knots/${req.body.knotName}`,
            knotObject.tap,
            knotObject.target
          )
        );

        fs.watchFile('tap.log', () => {
          exec('tail -n 1 tap.log', (error, stdout) => {
            req.io.emit('tapLog', stdout.toString());
          });
        });

        fs.watchFile('target.log', () => {
          exec('tail -n 1 target.log', (error, stdout) => {
            req.io.emit('targetLog', stdout.toString());
          });
        });

        syncData.on('exit', () => {
          addKnotAttribute(
            {
              field: ['lastRun'],
              value: new Date().toISOString()
            },
            path.resolve(`${tempFolder}/knots/${knotName}`, 'knot.json')
          )
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        });
      })
      .catch((err) => {
        console.log('Bane', err);
      });
  });

const getToken = (knot) =>
  new Promise((resolve, reject) => {
    if (knot) {
      readFile(path.resolve(tempFolder, 'knots', knot, 'target', 'config.json'))
        .then((configObject) => resolve(configObject.api_token))
        .catch((err) => {
          reject(err);
        });
    } else {
      reject();
    }
  });

module.exports = {
  partialSync,
  getToken,
  readFile,
  writeFile,
  addKnotAttribute
};
