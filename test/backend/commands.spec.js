import path from 'path';
import { commands } from '../../app/backend/constants';

describe('commands', () => {
  it('returns the correct discovery command', () => {
    const expected = `docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-redshift/data" dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json -d > "${path.resolve(
      'applicationFolder'
    )}/tap/catalog.json"`;

    const actual = commands.runDiscovery(
      'applicationFolder',
      'tap-redshift',
      'dataworld/tap-redshift:1.0.0b8'
    );

    expect(actual).toEqual(expected);
  });

  it('returns the correct sync command (uses catalog)', () => {
    const expected = `docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-redshift/data" --interactive dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json --catalog tap-redshift/data/catalog.json 2> "${path.resolve(
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
    )}/tap:/app/tap-redshift/data" --interactive dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json --properties tap-redshift/data/catalog.json 2> "${path.resolve(
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

  it('returns the correct partial sync command (uses catalog)', () => {
    const expected = `tail -1 "${path.resolve(
      'applicationFolder'
    )}/tap/state.json" > "${path.resolve(
      'applicationFolder'
    )}/tap/latest-state.json"; \\
    docker run -v "${path.resolve(
      'applicationFolder'
    )}/tap:/app/tap-redshift/data" --interactive dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json --catalog tap-redshift/data/catalog.json --state tap-redshift/data/latest-state.json 2> "${path.resolve(
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
    )}/tap:/app/tap-redshift/data" --interactive dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json --properties tap-redshift/data/catalog.json --state tap-redshift/data/latest-state.json 2> "${path.resolve(
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
});
