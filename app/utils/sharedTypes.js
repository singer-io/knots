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

/**
 * TAPS
 */
type TapRedshiftFields = {
  host: string,
  dbname: string,
  port: ?number,
  schema: string,
  user: string,
  password: string,
  start_date: string
};

type TapSalesforceFields = {
  client_id: string,
  client_secret: string,
  refresh_token: string,
  api_type: string,
  select_fields_by_default: boolean,
  start_date: string
};

type TapPostgresFields = {
  host: string,
  port: ?number,
  dbname: string,
  user: string,
  password: string
};

type TapAdwordsFields = {
  developer_token: string,
  oauth_client_id: string,
  oauth_client_secret: string,
  refresh_token: string,
  start_date: string,
  user_agent: string,
  customer_ids: string
};

type TapMySQLFields = {
  host: string,
  port: ?number,
  user: string,
  password: string,
  database: string
};

type TapFacebookFields = {
  access_token: string,
  account_id: string,
  app_id: string,
  app_secret: string,
  start_date: string
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

export type TapAdwords = {
  valid: boolean,
  fieldValues: TapAdwordsFields
};

export type TapMySQL = {
  valid: boolean,
  fieldValues: TapMySQLFields
};

export type TapFacebook = {
  valid: boolean,
  fieldValues: TapFacebookFields
};

/**
 * ACTIONS
 */

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
    replicationMethod?: boolean
  },
  usesCatalogArg?: boolean,
  usesReplication?: boolean
};

export type TapPropertiesType = {
  name: string,
  image: string,
  specImplementation?: SpecImplementationPropType
};

/**
 * STATE
 */

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

export type AdwordsState = {
  developer_token: FieldState,
  oauth_client_id: FieldState,
  oauth_client_secret: FieldState,
  refresh_token: FieldState,
  start_date: FieldState,
  customer_ids: FieldState,
  user_agent: FieldState
};

export type MySQLState = {
  host: FieldState,
  port: FieldState,
  user: FieldState,
  password: FieldState,
  database: FieldState
};

export type FacebookState = {
  app_id: FieldState,
  account_id: FieldState,
  access_token: FieldState,
  app_secret: FieldState,
  start_date: FieldState
};
