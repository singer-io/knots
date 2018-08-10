export const sampleTargets = [
  {
    name: 'SampleTarget1',
    targetKey: 'target-sample1',
    targetImage: '',
    repo: ''
  },
  {
    name: 'SampleTarget2',
    targetKey: 'target-sample2',
    targetImage: '',
    repo: ''
  }
];

export const sampleTaps = [
  {
    name: 'sampleTap1',
    tapImage: 'sampleTap1',
    tapKey: 'tap-sampleTap1'
  },
  {
    name: 'sampleTap2',
    tapImage: 'sampleTap2',
    tapKey: 'tap-sampleTap2'
  }
];

export const sampleSelectedTap = {
  name: 'tap-salesforce',
  image: ''
};

export const sampleUpdatedSFTap = {
  valid: false,
  fieldValues: {
    api_type: 'BULK',
    client_id: '12090',
    client_secret: '',
    refresh_token: '',
    select_fields_by_default: true,
    start_date: ''
  }
};

export const sampleUpdatedRedshiftTap = {
  valid: false,
  fieldValues: {
    host: 'testing',
    port: undefined,
    dbname: '',
    schema: 'public',
    user: '',
    password: '',
    start_date: ''
  }
};

export const sampleTapConfig = { start_date: '01-01-2017' };

export const sampleSchema = [{ tap_stream_id: 'testing' }];
