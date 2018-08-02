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

export type TapRedshiftFields = {
  host: string,
  dbname: string,
  port: ?number,
  schema: string,
  user: string,
  password: string,
  start_date: string
};

export type TapSalesforceFields = {
  client_id: string,
  client_secret: string,
  refresh_token: string,
  api_type: string,
  select_fields_by_default: boolean,
  start_date: string
};

export type TapPostgresFields = {
  host: string,
  port: ?number,
  dbname: string,
  user: string,
  password: string
};

export type TapRedshift = {
  valid: boolean,
  fieldValues: TapRedshiftFields
};

export type TapSalesforce = {
  valid: boolean,
  fieldValues: TapSalesforceFields
};

export type TapPostgres = {
  valid: boolean,
  fieldValues: TapPostgresFields
};

export type UpdateTapField = (
  tap: string,
  field: string,
  value: string | number
) => void;

export type UpdateFormValidation = (tap: string, value: boolean) => void;

export type FieldState = { validation: {}, errorMessage: string };

export type SpecImplementationPropType = {
  usesMetadata?: {
    selected?: boolean,
    replicationKey?: boolean,
    replicationMethod?: boolean,
    usesReplication?: boolean
  },
  usesCatalogArg?: boolean
};

export type TapPropertiesType = {
  name: string,
  image: string,
  specImplementation?: SpecImplementationPropType
};

export type RedshiftState = {
  host: FieldState,
  port: FieldState,
  dbname: FieldState,
  schema: FieldState,
  user: FieldState,
  password: FieldState,
  start_date: FieldState
};

export type PostgresState = {
  host: FieldState,
  port: FieldState,
  dbname: FieldState,
  user: FieldState,
  password: FieldState
};

export type SalesforceState = {
  client_id: FieldState,
  client_secret: FieldState,
  refresh_token: FieldState,
  start_date: FieldState,
  api_type: FieldState,
  select_fields_by_default: FieldState
};
