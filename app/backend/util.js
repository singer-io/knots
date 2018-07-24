/*
 * knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the
 * License.
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc.(http://data.world/).
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { set } = require('lodash');
const { app } = require('electron');

const getApplicationFolder = () => {
  let applicationFolder;
  if (process.env.NODE_ENV === 'production') {
    if (app) {
      // Knots are stored on the user's home path in the packaged app
      applicationFolder = path.resolve(app.getPath('home'), '.knots');
    } else {
      // app is undefined when running tests, get home dir using node
      const homePath = os.homedir();
      applicationFolder = path.resolve(homePath, '.knots');
    }
  } else {
    // Use the repo during development
    applicationFolder = path.resolve(__dirname, '../..');
  }

  return applicationFolder;
};

const getKnotsFolder = () => {
  const applicationFolder = getApplicationFolder();

  return path.resolve(applicationFolder, 'knots');
};

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
    fs.writeFile(filePath, content, (error) => {
      if (!error) {
        resolve();
      }

      reject(error);
    });
  });

const addKnotAttribute = (content, pathToKnot) =>
  new Promise((resolve, reject) => {
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
  getApplicationFolder,
  getKnotsFolder,
  readFile,
  writeFile,
  addKnotAttribute
};
