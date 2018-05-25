const path = require('path');
const { exec } = require('child_process');
const shell = require('shelljs');
const { app } = require('electron');

const { writeFile, readFile } = require('./util');
const {
  taps,
  tapRedshiftFields,
  tapSalesforceFields,
  commands
} = require('./constants');

let applicationFolder;
let runningProcess;
if (process.env.NODE_ENV === 'production') {
  applicationFolder = path.resolve(app.getPath('home'), 'knots');
} else {
  applicationFolder = path.resolve(__dirname, '../../');
}

const createKnot = (tapName, tapImage) =>
  new Promise((resolve, reject) => {
    // Create knots folder if it doesn't exist
    shell.mkdir('-p', applicationFolder);

    writeFile(
      path.resolve(applicationFolder, 'knot.json'),
      JSON.stringify({
        tap: {
          name: tapName,
          image: tapImage
        }
      })
    )
      .then(() => {
        resolve();
      })
      .catch(reject);
  });

const writeConfig = (config) =>
  new Promise((resolve, reject) => {
    writeFile(
      path.resolve(applicationFolder, 'config.json'),
      JSON.stringify(config)
    )
      .then(() => {
        // Remove any previously saved temp config
        shell.rm('-rf', path.resolve(applicationFolder, 'configs', 'tap'));
        shell.mkdir('-p', path.resolve(applicationFolder, 'configs', 'tap'));
        shell.mv(
          path.resolve(applicationFolder, 'config.json'),
          path.resolve(applicationFolder, 'configs', 'tap')
        );
        resolve();
      })
      .catch(reject);
  });

const getSchema = (req) =>
  new Promise((resolve, reject) => {
    const runDiscovery = exec(
      commands.runDiscovery(
        applicationFolder,
        req.body.tap.name,
        req.body.tap.image
      ),
      { detached: true }
    );
    runningProcess = runDiscovery;

    runDiscovery.stderr.on('data', (data) => {
      req.io.emit('schemaLog', data.toString());
    });

    runDiscovery.on('exit', (code) => {
      if (code > 0) {
        reject(
          new Error(
            `${commands.runDiscovery(
              applicationFolder,
              req.body.tap.name,
              req.body.tap.image
            )} command failed`
          )
        );
      }
      resolve();
    });
  });

const readSchema = () =>
  new Promise((resolve, reject) => {
    const schemaPath = path.resolve(
      applicationFolder,
      'configs',
      'tap',
      'catalog.json'
    );
    readFile(schemaPath)
      .then((schemaString) => {
        try {
          // Try to turn to object to validate it's a valid object
          const schema = JSON.parse(schemaString);

          // All good, return the schema object
          resolve(schema);
        } catch (error) {
          // Not a valid object, pass on the error
          reject(error);
        }
      })
      .catch(reject);
  });

const addConfig = (req) =>
  new Promise((resolve, reject) => {
    // Write the config to configs/tap/
    writeConfig(req.body.tapConfig)
      .then(() => {
        // Get tap schema by running discovery mode
        getSchema(req)
          .then(() => {
            // Schema now on file, read it and return the result
            readSchema()
              .then(resolve)
              .catch(reject);
          })
          .catch(reject);
      })
      .catch(reject);
  });

const getTaps = () =>
  new Promise((resolve, reject) => {
    if (taps) {
      resolve(taps);
    } else {
      reject(new Error('No taps available'));
    }
  });

const fetchTapFields = (tap, image) =>
  new Promise((resolve, reject) => {
    createKnot(tap, image)
      .then(() => {
        switch (tap) {
          case 'tap-redshift':
            resolve(tapRedshiftFields);
            break;
          case 'tap-salesforce':
            resolve(tapSalesforceFields);
            break;
          default:
            reject(new Error('Unknown tap'));
        }
      })
      .catch(reject);
  });

const writeSchema = (schemaObject) =>
  new Promise((resolve, reject) => {
    writeFile(
      path.resolve(applicationFolder, 'catalog.json'),
      JSON.stringify(schemaObject)
    )
      .then(() => {
        shell.rm(
          '-f',
          path.resolve(applicationFolder, 'configs', 'tap', 'catalog.json')
        );
        shell.mv(
          path.resolve(applicationFolder, 'catalog.json'),
          path.resolve(applicationFolder, 'configs', 'tap')
        );
        resolve();
      })
      .catch(reject);
  });

const terminateDiscovery = () => {
  if (runningProcess) {
    return runningProcess.pid;
  }
};

module.exports = {
  getTaps,
  fetchTapFields,
  addConfig,
  writeSchema,
  runningProcess,
  terminateDiscovery
};
