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
// @flow

import type { Stream, SubMetadata } from './sharedTypes';

// Find metadata with empty breadcrumb and return its index and metadata
export const getMetadata = (
  stream: Stream
): { index?: number, metadata?: {} } => {
  const { metadata = [] } = stream;

  let index;
  metadata.forEach((meta, metaIndex) => {
    if (meta.breadcrumb.length === 0) {
      index = metaIndex;
    }
  });

  if (index === undefined) {
    return { index };
  }

  return { index, metadata: metadata[index].metadata };
};

export const getColumns = (stream: Stream): Array<string> => {
  const { metadata = [] } = stream;

  const columns = metadata
    .filter((meta) => {
      if (meta.breadcrumb.length > 1) {
        if (
          meta.breadcrumb[0] === 'properties' &&
          meta.metadata.inclusion !== 'unsupported'
        ) {
          return true;
        }
      }
      return false;
    })
    .map((meta) => meta.breadcrumb[1]);

  return columns;
};

export const getReplicationKey = (
  stream: { replication_key?: string },
  metadata: SubMetadata,
  specImplementation: { usesMetadata?: { replicationKey?: boolean } }
): string => {
  const { replicationKey: repKeyMetadata = true } =
    specImplementation.usesMetadata || {};
  if (!repKeyMetadata) {
    return stream.replication_key || '';
  }

  return metadata['replication-key'] || '';
};
