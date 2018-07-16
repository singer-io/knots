import path from 'path';
import { commands } from '../../app/backend/constants';

const homePath = process.env.HOME;

describe('commands', () => {
  it('returns the correct discovery command (without docker parameters)', () => {
    const expected = `docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-redshift/data" dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json -d`;

    const actual = commands.runDiscovery('applicationFolder', {
      name: 'tap-redshift',
      image: 'dataworld/tap-redshift:1.0.0b8',
      specImplementation: {
        usesCatalogArg: false
      }
    });

    expect(actual).toEqual(expected);
  });

  it('returns the correct discovery command (with docker parameters)', () => {
    const expected = `docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-s3-csv/data" -v ${homePath}/.aws:/root/.aws dataworld/tap-s3-csv:0.0.3 tap-s3-csv -c tap-s3-csv/data/config.json -d > "${path.resolve(
      'applicationFolder'
    )}/tap/catalog.json"`;

    const actual = commands.runDiscovery('applicationFolder', {
      name: 'tap-s3-csv',
      image: 'dataworld/tap-s3-csv:0.0.3',
      specImplementation: {
        usesCatalogArg: false,
        dockerParameters: `-v ${homePath}/.aws:/root/.aws`
      }
    });

    expect(actual).toEqual(expected);
  });

  it('returns the correct sync command (uses catalog)', () => {
    const expected = `docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-redshift/data"  --interactive dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json --catalog tap-redshift/data/catalog.json 2> "${path.resolve(
      'applicationFolder'
    )}/tap.log" | docker run -v "${path.resolve(
      'applicationFolder'
    )}/target:/app/target-datadotworld/data" --interactive dataworld/target-datadotworld:1.0.1 target-datadotworld -c target-datadotworld/data/config.json 2> "${path.resolve(
      'applicationFolder'
    )}/target.log" > "${path.resolve('applicationFolder')}/tap/state.json"`;

    const actual = commands.runSync(
      'applicationFolder',
      { name: 'tap-redshift', image: 'dataworld/tap-redshift:1.0.0b8' },
      {
        name: 'target-datadotworld',
        image: 'dataworld/target-datadotworld:1.0.1'
      }
    );

    expect(actual).toEqual(expected);
  });

  it('returns the correct sync command (uses properties)', () => {
    const expected = `docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-redshift/data"  --interactive dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json --properties tap-redshift/data/catalog.json 2> "${path.resolve(
      'applicationFolder'
    )}/tap.log" | docker run -v "${path.resolve(
      'applicationFolder'
    )}/target:/app/target-datadotworld/data" --interactive dataworld/target-datadotworld:1.0.1 target-datadotworld -c target-datadotworld/data/config.json 2> "${path.resolve(
      'applicationFolder'
    )}/target.log" > "${path.resolve('applicationFolder')}/tap/state.json"`;

    const actual = commands.runSync(
      'applicationFolder',
      {
        name: 'tap-redshift',
        image: 'dataworld/tap-redshift:1.0.0b8',
        specImplementation: {
          usesCatalogArg: false
        }
      },
      {
        name: 'target-datadotworld',
        image: 'dataworld/target-datadotworld:1.0.1'
      }
    );

    expect(actual).toEqual(expected);
  });

  it('returns the correct sync command (with docker parameters)', () => {
    const expected = `docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-s3-csv/data" -v ${homePath}/.aws:/root/.aws --interactive dataworld/tap-s3-csv:0.0.3 tap-s3-csv -c tap-s3-csv/data/config.json --properties tap-s3-csv/data/catalog.json 2> "${path.resolve(
      'applicationFolder'
    )}/tap.log" | docker run -v "${path.resolve(
      'applicationFolder'
    )}/target:/app/target-datadotworld/data" --interactive dataworld/target-datadotworld:1.0.1 target-datadotworld -c target-datadotworld/data/config.json 2> "${path.resolve(
      'applicationFolder'
    )}/target.log" > "${path.resolve('applicationFolder')}/tap/state.json"`;

    const actual = commands.runSync(
      'applicationFolder',
      {
        name: 'tap-s3-csv',
        image: 'dataworld/tap-s3-csv:0.0.3',
        specImplementation: {
          usesCatalogArg: false,
          dockerParameters: `-v ${homePath}/.aws:/root/.aws`
        }
      },
      {
        name: 'target-datadotworld',
        image: 'dataworld/target-datadotworld:1.0.1'
      }
    );

    expect(actual).toEqual(expected);
  });

  it('returns the correct partial sync command (uses catalog)', () => {
    const expected = `tail -1 "${path.resolve(
      'applicationFolder'
    )}/tap/state.json" > "${path.resolve(
      'applicationFolder'
    )}/tap/latest-state.json"; \\
    docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-redshift/data"  --interactive dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json --catalog tap-redshift/data/catalog.json --state tap-redshift/data/latest-state.json 2> "${path.resolve(
      'applicationFolder',
      'tap.log'
    )}" | docker run -v "${path.resolve(
      'applicationFolder'
    )}/target:/app/target-datadotworld/data" --interactive dataworld/target-datadotworld:1.0.1 target-datadotworld -c target-datadotworld/data/config.json 2> "${path.resolve(
      'applicationFolder',
      'target.log'
    )}" > "${path.resolve('applicationFolder')}/tap/state.json"`;

    const actual = commands.runPartialSync(
      'applicationFolder',
      {
        name: 'tap-redshift',
        image: 'dataworld/tap-redshift:1.0.0b8'
      },
      {
        name: 'target-datadotworld',
        image: 'dataworld/target-datadotworld:1.0.1'
      }
    );

    expect(actual).toEqual(expected);
  });

  it('returns the correct partial sync command (uses properties)', () => {
    const expected = `tail -1 "${path.resolve(
      'applicationFolder'
    )}/tap/state.json" > "${path.resolve(
      'applicationFolder'
    )}/tap/latest-state.json"; \\
    docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-redshift/data"  --interactive dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json --properties tap-redshift/data/catalog.json --state tap-redshift/data/latest-state.json 2> "${path.resolve(
      'applicationFolder',
      'tap.log'
    )}" | docker run -v "${path.resolve(
      'applicationFolder'
    )}/target:/app/target-datadotworld/data" --interactive dataworld/target-datadotworld:1.0.1 target-datadotworld -c target-datadotworld/data/config.json 2> "${path.resolve(
      'applicationFolder',
      'target.log'
    )}" > "${path.resolve('applicationFolder')}/tap/state.json"`;

    const actual = commands.runPartialSync(
      'applicationFolder',
      {
        name: 'tap-redshift',
        image: 'dataworld/tap-redshift:1.0.0b8',
        specImplementation: {
          usesCatalogArg: false
        }
      },
      {
        name: 'target-datadotworld',
        image: 'dataworld/target-datadotworld:1.0.1'
      }
    );

    expect(actual).toEqual(expected);
  });

  it('returns the correct partial sync command (with docker parameters)', () => {
    const expected = `tail -1 "${path.resolve(
      'applicationFolder'
    )}/tap/state.json" > "${path.resolve(
      'applicationFolder'
    )}/tap/latest-state.json"; \\
    docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-s3-csv/data" -v ${homePath}/.aws:/root/.aws --interactive dataworld/tap-s3-csv:0.0.3 tap-s3-csv -c tap-s3-csv/data/config.json --properties tap-s3-csv/data/catalog.json --state tap-s3-csv/data/latest-state.json 2> "${path.resolve(
      'applicationFolder',
      'tap.log'
    )}" | docker run -v "${path.resolve(
      'applicationFolder'
    )}/target:/app/target-datadotworld/data" --interactive dataworld/target-datadotworld:1.0.1 target-datadotworld -c target-datadotworld/data/config.json 2> "${path.resolve(
      'applicationFolder',
      'target.log'
    )}" > "${path.resolve('applicationFolder')}/tap/state.json"`;

    const actual = commands.runPartialSync(
      'applicationFolder',
      {
        name: 'tap-s3-csv',
        image: 'dataworld/tap-s3-csv:0.0.3',
        specImplementation: {
          usesCatalogArg: false,
          dockerParameters: `-v ${homePath}/.aws:/root/.aws`
        }
      },
      {
        name: 'target-datadotworld',
        image: 'dataworld/target-datadotworld:1.0.1'
      }
    );

    expect(actual).toEqual(expected);
  });
});
