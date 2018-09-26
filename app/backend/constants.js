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

const homePath = process.env.HOME;

const taps = [
  {
    name: 'Adwords',
    tapKey: 'tap-adwords',
    tapImage: 'dataworld/tap-adwords:1.3.3',
    repo: 'https://github.com/singer-io/tap-adwords',
    specImplementation: {
      usesCatalogArg: false,
      mustSeedState: {
        usesOther: false
      }
    }
  },
  {
    name: 'Amazon S3',
    tapKey: 'tap-s3-csv',
    tapImage: 'dataworld/tap-s3-csv:0.0.3',
    repo: 'https://github.com/singer-io/tap-s3-csv',
    specImplementation: {
      usesCatalogArg: false,
      dockerParameters: `-v ${homePath}/.aws:/root/.aws`
    }
  },
  {
    name: 'Facebook',
    tapKey: 'tap-facebook',
    tapImage: 'dataworld/tap-facebook:1.5.1',
    repo: 'https://github.com/singer-io/tap-facebook',
    specImplementation: {
      usesMetadata: {
        selected: false,
        replication_key: false,
        replication_method: false
      },
      usesCatalogArg: false,
      mustSeedState: {
        usesOther: false
      }
    }
  },
  {
    name: 'MySQL',
    tapKey: 'tap-mysql',
    tapImage: 'dataworld/tap-mysql:1.9.10',
    repo: 'https://github.com/singer-io/tap-mysql',
    specImplementation: {
      usesMetadata: {
        selected: false
      }
    }
  },
  {
    name: 'Postgres',
    tapKey: 'tap-postgres',
    tapImage: 'dataworld/tap-postgres:0.0.16',
    repo: 'https://github.com/singer-io/tap-postgres'
  },
  {
    name: 'Redshift',
    tapKey: 'tap-redshift',
    tapImage: 'dataworld/tap-redshift:1.0.0b9',
    repo: 'https://github.com/datadotworld/tap-redshift'
  },
  {
    name: 'Salesforce',
    tapKey: 'tap-salesforce',
    tapImage: 'dataworld/tap-salesforce:1.4.14',
    repo: 'https://github.com/singer-io/tap-salesforce',
    specImplementation: {
      usesCatalogArg: false
    }
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
    targetImage: 'dataworld/target-stitch:1.7.4',
    repo: 'https://github.com/singer-io/target-stitch'
  }
];

const commands = {
  runDiscovery: (folderPath, tap) => {
    const { dockerParameters = '' } = tap.specImplementation || {};
    return `docker run -v "${path.resolve(folderPath)}/tap:/app/${
      tap.name
    }/data" ${dockerParameters} ${tap.image} ${tap.name} -c ${
      tap.name
    }/data/config.json -d > "${path.resolve(folderPath)}/tap/catalog.json"`;
  },
  runSync: (folderPath, tap, target) => {
    const { usesCatalogArg = true, dockerParameters = '' } =
      tap.specImplementation || {};
    return `docker run -v "${path.resolve(folderPath)}/tap:/app/${
      tap.name
    }/data" ${dockerParameters} --interactive ${tap.image} ${tap.name} -c ${
      tap.name
    }/data/config.json ${usesCatalogArg ? '--catalog' : '--properties'} ${
      tap.name
    }/data/catalog.json 2> "${path.resolve(
      folderPath,
      'tap.log'
    )}" | docker run -v "${path.resolve(folderPath)}/target:/app/${
      target.name
    }/data" --interactive ${target.image} ${target.name} -c ${
      target.name
    }/data/config.json 2> "${path.resolve(
      folderPath,
      'target.log'
    )}" > "${path.resolve(folderPath)}/tap/state.json"`;
  },
  runPartialSync: (folderPath, tap, target) => {
    const { usesCatalogArg = true, dockerParameters = '' } =
      tap.specImplementation || {};
    return `docker run -v "${path.resolve(folderPath)}/tap:/app/${
      tap.name
    }/data" ${dockerParameters} --interactive ${tap.image} ${tap.name} -c ${
      tap.name
    }/data/config.json ${usesCatalogArg ? '--catalog' : '--properties'} ${
      tap.name
    }/data/catalog.json --state ${
      tap.name
    }/data/latest-state.json 2> "${path.resolve(
      folderPath,
      'tap.log'
    )}" | docker run -v "${path.resolve(folderPath)}/target:/app/${
      target.name
    }/data" --interactive ${target.image} ${target.name} -c ${
      target.name
    }/data/config.json 2> "${path.resolve(
      folderPath,
      'target.log'
    )}" > "${path.resolve(folderPath)}/tap/state.json"`;
  }
};

module.exports = {
  taps,
  commands,
  targets
};
