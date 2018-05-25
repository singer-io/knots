const fs = require('fs');
const path = require('path');
const { set } = require('lodash');
const { app } = require('electron');

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

module.exports = {
  readFile,
  writeFile,
  addKnotAttribute
};
