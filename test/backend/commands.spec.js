import { commands } from '../../app/backend/constants';

describe('commands', () => {
  it('returns the correct discovery command', () => {
    const expected =
      'docker run -v "applicationFolder/tap:/app/tap-redshift/data" dataworld/tap-redshift:1.0.0b8 tap-redshift -c tap-redshift/data/config.json -d > "applicationFolder/tap/catalog.json"';

    const actual = commands.runDiscovery(
      'applicationFolder',
      'tap-redshift',
      'dataworld/tap-redshift:1.0.0b8'
    );

    expect(expected).toEqual(actual);
  });
});
