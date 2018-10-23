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
