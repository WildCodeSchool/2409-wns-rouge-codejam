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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
};

/** Cancelation possible reason */
export enum CancelationReadon {
  Canceledadmin = 'CANCELEDADMIN',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Subscribed = 'SUBSCRIBED',
  Unpaid = 'UNPAID'
}

export type Execution = {
  __typename?: 'Execution';
  executedAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  result: Scalars['String']['output'];
  snippet: Snippet;
  status: ExecutionStatus;
};

/** Execution possible status */
export enum ExecutionStatus {
  Error = 'ERROR',
  Success = 'SUCCESS'
}

/** Supported programming languages */
export enum Language {
  Javascript = 'JAVASCRIPT',
  Typescript = 'TYPESCRIPT'
}

export type Mutation = {
  __typename?: 'Mutation';
  createPlan: Plan;
  createSnippet: Snippet;
  createUser?: Maybe<User>;
  deleteSnippet: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  execute?: Maybe<Execution>;
  login?: Maybe<User>;
  logout: Scalars['Boolean']['output'];
  subscribe: UserSubscription;
  unsubscribe: Scalars['Boolean']['output'];
  updatePlan: Plan;
  updateSnippet: Snippet;
  updateUser?: Maybe<User>;
  updateUserSubscription?: Maybe<UserSubscription>;
};


export type MutationCreatePlanArgs = {
  data: PlanCreateInput;
};


export type MutationCreateSnippetArgs = {
  data: SnippetCreateInput;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationDeleteSnippetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationExecuteArgs = {
  data: SnippetCreateInput;
  snippetId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationLoginArgs = {
  data: UserLoginInput;
};


export type MutationSubscribeArgs = {
  data: UserSubscriptionCreateInput;
};


export type MutationUnsubscribeArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationUpdatePlanArgs = {
  data: PlanUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateSnippetArgs = {
  data: SnippetUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationUpdateUserSubscriptionArgs = {
  data: UserSubscriptionUpdateInput;
  email: Scalars['String']['input'];
};

export type Plan = {
  __typename?: 'Plan';
  createdAt: Scalars['DateTime']['output'];
  executionLimit: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  subscriptions: Array<UserSubscription>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PlanCreateInput = {
  executionLimit: Scalars['Int']['input'];
  isDefault: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
};

export type PlanUpdateInput = {
  executionLimit: Scalars['Int']['input'];
  isDefault: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  getActiveSubscription?: Maybe<UserSubscription>;
  getAllSnippets: Array<Snippet>;
  getAllUsersSubscriptions: Array<User>;
  getSnippet?: Maybe<Snippet>;
  plans: Array<Plan>;
  user?: Maybe<User>;
  users: Array<User>;
  whoAmI?: Maybe<User>;
};


export type QueryGetActiveSubscriptionArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetSnippetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Snippet = {
  __typename?: 'Snippet';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  executions?: Maybe<Array<Execution>>;
  id: Scalars['ID']['output'];
  language: Language;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type SnippetCreateInput = {
  code: Scalars['String']['input'];
  language: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type SnippetUpdateInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Language>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  role: UserRole;
  snippets: Array<Snippet>;
  subscriptions: Array<UserSubscription>;
  updatedAt: Scalars['DateTime']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type UserCreateInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type UserLoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** User possible roles */
export enum UserRole {
  Admin = 'ADMIN',
  Guest = 'GUEST',
  User = 'USER'
}

export type UserSubscription = {
  __typename?: 'UserSubscription';
  cancellationReason: CancelationReadon;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  plan: Plan;
  subscribedAt: Scalars['DateTime']['output'];
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
};

export type UserSubscriptionCreateInput = {
  planId: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UserSubscriptionUpdateInput = {
  cancellationReason?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  terminatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserUpdateInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserMutationVariables = Exact<{
  data: UserCreateInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'User', email?: string | null, username?: string | null, id: string } | null };

export type LoginMutationVariables = Exact<{
  data: UserLoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', id: string, username?: string | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type WhoAmIQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoAmIQuery = { __typename?: 'Query', whoAmI?: { __typename?: 'User', id: string, username?: string | null, email?: string | null } | null };


export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const WhoAmIDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"whoAmI"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoAmI"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<WhoAmIQuery, WhoAmIQueryVariables>;