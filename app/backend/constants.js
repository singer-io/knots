/*
 * Knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */

const path = require('path');

const taps = [
  {
    name: 'Redshift',
    tapKey: 'tap-redshift',
    tapImage: 'dataworld/tap-redshift:1.0.0b8',
    repo: 'https://github.com/datadotworld/tap-redshift',
    isLegacy: false
  },
  {
    name: 'Salesforce',
    tapKey: 'tap-salesforce',
    tapImage: 'gbolahan/tap-salesforce:1.0',
    repo: 'https://github.com/singer-io/tap-salesforce',
    isLegacy: false
  }
];

const targets = [
  {
    name: 'data.world',
    targetKey: 'target-datadotworld',
    targetImage: 'dataworld/target-datadotworld:1.0.1',
    repo: 'https://github.com/datadotworld/target-datadotworld'
  },
  {
    name: 'Stitch',
    targetKey: 'target-stitch',
    targetImage: 'gbolahan/target-stitch:1.0',
    repo: 'https://github.com/singer-io/target-stitch'
  }
];

const commands = {
  runDiscovery: (folderPath, tap, image) =>
    `docker run -v "${folderPath}/configs/tap:/app/${tap}/data" ${image} ${tap} -c ${tap}/data/config.json -d > "${folderPath}/configs/tap/catalog.json"`,
  runSync: (folderPath, tap, target) =>
    `docker run -v "${folderPath}/tap:/app/${tap.name}/data" --interactive ${
      tap.image
    } ${tap.name} -c ${tap.name}/data/config.json --properties ${
      tap.name
    }/data/catalog.json 2> "${path.resolve(
      folderPath,
      'tap.log'
    )}" | docker run -v "${folderPath}/target:/app/${
      target.name
    }/data" --interactive ${target.image} ${target.name} -c ${
      target.name
    }/data/config.json 2> "${path.resolve(
      folderPath,
      'target.log'
    )}" > "${folderPath}/tap/state.json"`,
  runPartialSync: (folderPath, tap, target) =>
    `docker run -v "${folderPath}/tap:/app/${tap.name}/data" --interactive ${
      tap.image
    } ${tap.name} -c ${tap.name}/data/config.json --properties ${
      tap.name
    }/data/catalog.json --state ${tap.name}/data/state.json 2> "${path.resolve(
      folderPath,
      'tap.log'
    )}" | docker run -v "${folderPath}/target:/app/${
      target.name
    }/data" --interactive ${target.image} ${target.name} -c ${
      target.name
    }/data/config.json 2> "${path.resolve(
      folderPath,
      'target.log'
    )}" > "${folderPath}/tap/latest-state.json";
    \\tail -1 "${folderPath}/tap/latest-state.json" > "${folderPath}/tap/state.json"`
};

module.exports = {
  taps,
  commands,
  targets
};
