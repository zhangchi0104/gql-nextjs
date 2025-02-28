/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum AustralianState {
  Act = 'ACT',
  Nsw = 'NSW',
  Nt = 'NT',
  Qld = 'QLD',
  Sa = 'SA',
  Tas = 'TAS',
  Vic = 'VIC',
  Wa = 'WA'
}

export type Localities = {
  __typename?: 'Localities';
  localities: Array<Locality>;
};

export type Locality = {
  __typename?: 'Locality';
  category: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  latitude: Scalars['Float']['output'];
  location: Scalars['String']['output'];
  longitude: Scalars['Float']['output'];
  postcode: Scalars['Int']['output'];
  state: AustralianState;
};

export type Query = {
  __typename?: 'Query';
  localities: Array<Locality>;
};


export type QueryLocalitiesArgs = {
  postcode?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<AustralianState>;
  suburb?: InputMaybe<Scalars['String']['input']>;
};

export type LocalityQueryVariables = Exact<{
  state?: InputMaybe<AustralianState>;
  postcode?: InputMaybe<Scalars['String']['input']>;
  suburb?: InputMaybe<Scalars['String']['input']>;
}>;


export type LocalityQuery = { __typename?: 'Query', localities: Array<{ __typename?: 'Locality', postcode: number, location: string, state: AustralianState }> };


export const LocalityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Locality"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AustralianState"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postcode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"suburb"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}},{"kind":"Argument","name":{"kind":"Name","value":"postcode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postcode"}}},{"kind":"Argument","name":{"kind":"Name","value":"suburb"},"value":{"kind":"Variable","name":{"kind":"Name","value":"suburb"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<LocalityQuery, LocalityQueryVariables>;