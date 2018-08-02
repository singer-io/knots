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

export type tapRedshiftFields = {
  host: string,
  dbname: string,
  port?: number,
  schema: string,
  user: string,
  password: string,
  start_date: string
};

export type tapSalesforceFields = {
  client_id: string,
  client_secret: string,
  refresh_token: string,
  api_type: string,
  select_fields_by_default: boolean,
  start_date: string
};

export type tapRedshift = {
  valid: boolean,
  fieldValues: tapRedshiftFields
};

export type tapSalesforce = {
  valid: boolean,
  fieldValues: tapSalesforceFields
};

export type updateTapField = (
  tap: string,
  field: string,
  value: string | number
) => void;

export type updateFormValidation = (tap: string, value: boolean) => void;

export type fieldState = { validation: {}, errorMessage: string };

export type specImplementationPropType = {
  usesMetadata?: {
    selected?: boolean,
    replicationKey?: boolean,
    replicationMethod?: boolean
  },
  usesCatalogArg?: boolean
};

export type tapPropertiesType = {
  name: string,
  image: string,
  specImplementation?: specImplementationPropType
};
