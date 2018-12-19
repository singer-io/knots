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

import path from 'path';
import fs from 'fs';
import os from 'os';
import shell from 'shelljs';

const sampleKnotJson1 = {
  tap: { name: 'tap-redshift', image: 'dataworld/tap-redshift:1.0.0b8' },
  target: {
    name: 'target-datadotworld',
    image: 'dataworld/target-datadotworld:1.0.1'
  },
  name: 'Redshift-Datadotworld',
  lastRun: '2018-07-13T12:30:03.380Z'
};

const sampleKnotJson2 = {
  tap: { name: 'tap-salesforce', image: 'dataworld/tap-salesforce:1.4.14' },
  target: {
    name: 'target-stitch',
    image: 'dataworld/target-stitch:1.7.4'
  },
  name: 'Salesforce-Stitch',
  lastRun: '2018-07-13T12:30:20.114Z'
};

export const sampleSavedKnot = {
  knotJson: {
    name: 'sampleSavedKnot',
    tap: { name: 'sampleTap', image: 'sampleTapImage' },
    target: { name: 'sampleTarget', image: 'sampleTargetImage' }
  },
  tapConfig: { host: 'www.example.com' },
  tapCatalog: { streams: [{ stream: 'sampleStream' }] },
  targetConfig: { user: 'exampleUser' }
};

export const invalidKnotString =
  '{"tap":{"name":"tap-salesforce","image":"dataworld/tap-salesforce:1.4.14"},"target":{"name":"target-stitch","image":"dataworld/target-stitch:1.7.4"},"name":"Salesforce-Stitch","lastRun":"2018-07-13T12:30:20.114Z"';

export const sampleKnotJsons = [sampleKnotJson1, sampleKnotJson2];

export const sampleTapCatalog = {
  streams: [
    {
      stream: 'sample_stream',
      tap_stream_id: 'sample_strem_id',
      metadata: [],
      schema: {}
    },
    {
      stream: 'sample_stream2',
      tap_stream_id: 'sample_strem_id2',
      metadata: [],
      schema: {}
    }
  ]
};

export const savedSampleTapCatalog = {
  streams: [
    {
      stream: 'saved_sample_stream',
      tap_stream_id: 'saved_sample_strem_id',
      metadata: [],
      schema: {}
    },
    {
      stream: 'saved_sample_stream2',
      tap_stream_id: 'saved_sample_strem_id2',
      metadata: [],
      schema: {}
    }
  ]
};

export const sampleTapConfig = {
  username: 'user',
  password: 123
};

export const seedKnots = () =>
  new Promise((resolve, reject) => {
    const sampleKnotNames = ['sample 1', 'sample 2'];

    shell.mkdir('-p', path.resolve('knotsTestFolder'));

    sampleKnotNames.forEach((knot) => {
      shell.mkdir('-p', path.resolve('knotsTestFolder', knot));
    });

    fs.writeFile(
      path.resolve('knotsTestFolder', 'sample 1', 'knot.json'),
      JSON.stringify(sampleKnotJsons[0]),
      (error) => {
        if (!error) {
          fs.writeFile(
            path.resolve('knotsTestFolder', 'sample 2', 'knot.json'),
            JSON.stringify(sampleKnotJsons[1]),
            (err) => {
              if (!err) {
                resolve();
              } else {
                reject(err);
              }
            }
          );
        } else {
          reject(error);
        }
      }
    );
  });

const writeFile = (filePath, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (error) => {
      if (!error) {
        resolve();
      }

      reject(error);
    });
  });

export const seedKnot = () =>
  new Promise((resolve, reject) => {
    shell.mkdir('-p', path.resolve('knotsTestFolder', 'savedKnot', 'tap'));
    shell.mkdir('-p', path.resolve('knotsTestFolder', 'savedKnot', 'target'));
    const promises = [
      writeFile(
        path.resolve('knotsTestFolder', 'savedKnot', 'knot.json'),
        JSON.stringify(sampleSavedKnot.knotJson)
      ),
      writeFile(
        path.resolve('knotsTestFolder', 'savedKnot', 'tap', 'config.json'),
        JSON.stringify(sampleSavedKnot.tapConfig)
      ),
      writeFile(
        path.resolve('knotsTestFolder', 'savedKnot', 'tap', 'catalog.json'),
        JSON.stringify(sampleSavedKnot.tapCatalog)
      ),
      writeFile(
        path.resolve('knotsTestFolder', 'savedKnot', 'target', 'config.json'),
        JSON.stringify(sampleSavedKnot.targetConfig)
      )
    ];

    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });

export const seedTempKnot = () =>
  new Promise((resolve, reject) => {
    shell.mkdir('-p', path.resolve('tmp', 'tempUUID', 'knot', 'tap'));
    shell.mkdir('-p', path.resolve('tmp', 'tempUUID', 'knot', 'target'));
    const promises = [
      writeFile(
        path.resolve('tmp', 'tempUUID', 'knot', 'knot.json'),
        JSON.stringify(sampleSavedKnot.knotJson)
      ),
      writeFile(
        path.resolve('tmp', 'tempUUID', 'knot', 'tap', 'config.json'),
        JSON.stringify(sampleSavedKnot.tapConfig)
      ),
      writeFile(
        path.resolve('tmp', 'tempUUID', 'knot', 'tap', 'catalog.json'),
        JSON.stringify(sampleSavedKnot.tapCatalog)
      ),
      writeFile(
        path.resolve('tmp', 'tempUUID', 'knot', 'target', 'config.json'),
        JSON.stringify(sampleSavedKnot.targetConfig)
      )
    ];

    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });

export const seedInvalidKnot = () =>
  new Promise((resolve, reject) => {
    shell.mkdir(
      '-p',
      path.resolve('knotsTestFolder', 'invalidSavedKnot', 'tap')
    );
    shell.mkdir(
      '-p',
      path.resolve('knotsTestFolder', 'invalidSavedKnot', 'target')
    );
    const promises = [
      writeFile(
        path.resolve('knotsTestFolder', 'invalidSavedKnot', 'knot.json'),
        '{name: "invalidKnot}'
      ),
      writeFile(
        path.resolve(
          'knotsTestFolder',
          'invalidSavedKnot',
          'tap',
          'config.json'
        ),
        JSON.stringify(sampleSavedKnot.tapConfig)
      ),
      writeFile(
        path.resolve(
          'knotsTestFolder',
          'invalidSavedKnot',
          'tap',
          'catalog.json'
        ),
        `${JSON.stringify(sampleSavedKnot.tapCatalog)}}`
      ),
      writeFile(
        path.resolve(
          'knotsTestFolder',
          'invalidSavedKnot',
          'target',
          'config.json'
        ),
        JSON.stringify(sampleSavedKnot.targetConfig)
      )
    ];

    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });

export const seedTapCatalog = () =>
  new Promise((resolve, reject) => {
    shell.mkdir('-p', path.resolve('tmp', 'uuid', 'knot', 'tap'));

    fs.writeFile(
      path.resolve('tmp', 'uuid', 'knot', 'tap', 'catalog.json'),
      JSON.stringify(sampleTapCatalog),
      (error) => {
        if (!error) {
          shell.mkdir(
            '-p',
            path.resolve('knotsTestFolder', 'savedKnot', 'tap')
          );
          fs.writeFile(
            path.resolve('knotsTestFolder', 'savedKnot', 'tap', 'catalog.json'),
            JSON.stringify(savedSampleTapCatalog),
            (err) => {
              if (!err) {
                shell.mkdir(
                  '-p',
                  path.resolve('knotsTestFolder', 'invalidKnot', 'tap')
                );
                fs.writeFile(
                  path.resolve(
                    'knotsTestFolder',
                    'invalidKnot',
                    'tap',
                    'catalog.json'
                  ),
                  'invalid json',
                  (er) => {
                    if (!er) {
                      resolve();
                    } else {
                      reject(er);
                    }
                  }
                );
              } else {
                reject(err);
              }
            }
          );
        } else {
          reject(error);
        }
      }
    );
  });

export const seedTapConfig = () =>
  new Promise((resolve, reject) => {
    shell.mkdir('-p', path.resolve('tmp', 'configUUID', 'knot', 'tap'));

    fs.writeFile(
      path.resolve('tmp', 'configUUID', 'knot', 'tap', 'config.json'),
      JSON.stringify(sampleTapConfig),
      (error) => {
        if (!error) {
          fs.writeFile(
            path.resolve('tmp', 'configUUID', 'knot', 'knot.json'),
            JSON.stringify({}),
            (e) => {
              if (!e) {
                resolve();
              } else {
                reject(e);
              }
            }
          );
        } else {
          reject(error);
        }
      }
    );
  });

export const cleanfs = () => {
  shell.rm('-rf', path.resolve('knotsTestFolder'));
  shell.rm('-rf', path.resolve('tmp'));
  shell.rm('-rf', path.resolve(os.homedir(), '.knots', 'tmp'));
};
