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

export const invalidKnotString =
  '{"tap":{"name":"tap-salesforce","image":"dataworld/tap-salesforce:1.4.14"},"target":{"name":"target-stitch","image":"dataworld/target-stitch:1.7.4"},"name":"Salesforce-Stitch","lastRun":"2018-07-13T12:30:20.114Z"';

export const sampleKnotJsons = [sampleKnotJson1, sampleKnotJson2];
