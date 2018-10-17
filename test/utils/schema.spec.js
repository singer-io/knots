import { getMetadata } from '../../app/utils/schema';

const sampleStream = {
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
        inclusion: 'automatic',
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

const sampleStreamNoMetadata = {
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
    },
    {
      breadcrumb: ['properties', 'category_id'],
      metadata: {
        'sql-datatype': 'smallint',
        inclusion: 'automatic',
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

const sampleStream1 = {
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
      breadcrumb: ['properties', 'picture'],
      metadata: {
        'sql-datatype': 'bytea',
        inclusion: 'unsupported',
        'selected-by-default': false
      }
    }
  ]
};

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
});
