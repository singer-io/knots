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

import {
  getMetadata,
  getColumns,
  getReplicationKey
} from '../../app/utils/schema';
import {
  sampleStream,
  sampleStream1,
  sampleStreamNoMetadata
} from '../samples';

describe('Schema functions', () => {
  describe('get metadata', () => {
    it('should return an object containing the metadata and index', () => {
      const expected = {
        index: 0,
        metadata: {
          'table-key-properties': ['category_id'],
          'schema-name': 'public',
          'database-name': 'northwind',
          'row-count': 8,
          'is-view': false
        }
      };
      const actual = getMetadata(sampleStream);

      const expected1 = {
        index: 3,
        metadata: {
          'table-key-properties': ['category_id'],
          'schema-name': 'public',
          'database-name': 'northwind-second',
          'row-count': 8,
          'is-view': false
        }
      };
      const actual1 = getMetadata(sampleStream1);

      expect(actual).toEqual(expected);
      expect(actual1).toEqual(expected1);
    });

    it('should return an object containing null as the values when empty breadcrumb is not found', () => {
      const expected = {
        index: undefined,
        metadata: undefined
      };
      const actual = getMetadata(sampleStreamNoMetadata);

      expect(actual).toEqual(expected);
    });
  });

  describe('get columns', () => {
    it('should return an array of column names', () => {
      const expected = ['category_name', 'description'];
      const actual = getColumns(sampleStream);

      const expected1 = ['category_id', 'contact_title'];
      const actual1 = getColumns(sampleStream1);

      expect(actual).toEqual(expected);
      expect(actual1).toEqual(expected1);
    });

    it('should return an empty array when a breadcrumb with properties as the first element is not found', () => {
      const expected = [];
      const actual = getColumns(sampleStreamNoMetadata);

      expect(actual).toEqual(expected);
    });
  });

  describe('get repliction key', () => {
    it('should return a replication key in metadata', () => {
      const expected = 'category_id';
      const actual = getReplicationKey(
        sampleStream,
        { 'replication-key': 'category_id' },
        {
          usesMetadata: {}
        }
      );

      expect(actual).toEqual(expected);
    });

    it('should return a replication key in the stream', () => {
      const expected = 'order_id';
      const actual = getReplicationKey(
        sampleStream,
        { 'replication-key': 'category_id' },
        { usesMetadata: { replicationKey: false } }
      );

      expect(actual).toEqual(expected);
    });

    it('should return an empty string when replicatin key is not specified', () => {
      const expected = '';
      const actual = getReplicationKey(
        sampleStream1,
        {},
        {
          usesMetadata: {}
        }
      );

      const expected1 = '';
      const actual1 = getReplicationKey(
        sampleStream1,
        { 'replication-key': 'category_id' },
        { usesMetadata: { replicationKey: false } }
      );

      expect(actual).toEqual(expected);
      expect(actual1).toEqual(expected1);
    });
  });
});
