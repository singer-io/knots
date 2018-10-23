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

export const sampleStream = {
  replication_key: 'order_id',
  tap_stream_id: 'northwind-public-categories',
  table_name: 'categories',
  schema: {
    properties: {
      category_id: {
        minimum: -32768,
        maximum: 32767,
        type: ['integer']
      },
      category_name: { maxLength: 15, type: ['null', 'string'] },
      description: { type: ['null', 'string'] },
      picture: {}
    },
    type: 'object'
  },
  stream: 'categories',
  metadata: [
    {
      breadcrumb: [],
      metadata: {
        'table-key-properties': ['category_id'],
        'schema-name': 'public',
        'database-name': 'northwind',
        'row-count': 8,
        'is-view': false
      }
    },
    {
      breadcrumb: ['properties', 'category_id'],
      metadata: {
        'sql-datatype': 'smallint',
        inclusion: 'unsupported',
        'selected-by-default': true
      }
    },
    {
      breadcrumb: ['properties', 'category_name'],
      metadata: {
        'sql-datatype': 'character varying',
        inclusion: 'available',
        'selected-by-default': true
      }
    },
    {
      breadcrumb: ['properties', 'description'],
      metadata: {
        'sql-datatype': 'text',
        inclusion: 'available',
        'selected-by-default': true
      }
    },
    {
      breadcrumb: ['properties', 'picture'],
      metadata: {
        'sql-datatype': 'bytea',
        inclusion: 'unsupported',
        'selected-by-default': false
      }
    }
  ]
};

export const sampleStreamNoMetadata = {
  tap_stream_id: 'northwind-public-categories',
  table_name: 'categories',
  schema: {
    properties: {
      category_id: {
        minimum: -32768,
        maximum: 32767,
        type: ['integer']
      },
      category_name: { maxLength: 15, type: ['null', 'string'] },
      description: { type: ['null', 'string'] },
      picture: {}
    },
    type: 'object'
  },
  stream: 'categories',
  metadata: [
    {
      breadcrumb: ['foo', 'bar'],
      metadata: {
        'table-key-properties': ['category_id'],
        'schema-name': 'public',
        'database-name': 'northwind',
        'row-count': 8,
        'is-view': false
      }
    }
  ]
};

export const sampleStream1 = {
  tap_stream_id: 'northwind-public-categories',
  table_name: 'categories',
  schema: {
    properties: {
      category_id: {
        minimum: -32768,
        maximum: 32767,
        type: ['integer']
      },
      category_name: { maxLength: 15, type: ['null', 'string'] },
      description: { type: ['null', 'string'] },
      picture: {}
    },
    type: 'object'
  },
  stream: 'categories',
  metadata: [
    {
      breadcrumb: ['properties', 'category_id'],
      metadata: {
        'sql-datatype': 'smallint',
        inclusion: 'automatic',
        'selected-by-default': true
      }
    },
    {
      breadcrumb: ['foo', 'company_name'],
      metadata: {
        'sql-datatype': 'character varying',
        inclusion: 'available',
        'selected-by-default': true
      }
    },
    {
      breadcrumb: ['bar'],
      metadata: {
        'sql-datatype': 'character varying',
        inclusion: 'available',
        'selected-by-default': true
      }
    },
    {
      breadcrumb: [],
      metadata: {
        'table-key-properties': ['category_id'],
        'schema-name': 'public',
        'database-name': 'northwind-second',
        'row-count': 8,
        'is-view': false
      }
    },
    {
      breadcrumb: ['properties', 'contact_title', 'third'],
      metadata: {
        'sql-datatype': 'character varying',
        inclusion: 'available',
        'selected-by-default': true
      }
    }
  ]
};
