/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any }
}

/** Cancelation possible reason */
export enum CancelationReadon {
  Canceledadmin = 'CANCELEDADMIN',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Subscribed = 'SUBSCRIBED',
  Unpaid = 'UNPAID',
}

export type Execution = {
  __typename?: 'Execution'
  executedAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  result: Scalars['String']['output']
  snippet: Snippet
  status: ExecutionStatus
}

/** Execution possible status */
export enum ExecutionStatus {
  Error = 'ERROR',
  Success = 'SUCCESS',
  Timeout = 'TIMEOUT',
}

/** Supported programming languages */
export enum Language {
  Javascript = 'JAVASCRIPT',
  Typescript = 'TYPESCRIPT',
}

export type Mutation = {
  __typename?: 'Mutation'
  createPlan: Plan
  createSnippet: Snippet
  createUser: User
  deleteSnippet: Scalars['Boolean']['output']
  deleteUser: Scalars['Boolean']['output']
  execute: Execution
  login?: Maybe<User>
  logout: Scalars['Boolean']['output']
  saveSnippet?: Maybe<Snippet>
  subscribe: UserSubscription
  unsubscribe: Scalars['Boolean']['output']
  updatePlan: Plan
  updateSnippet: Snippet
  updateUser?: Maybe<User>
  updateUserSubscription?: Maybe<UserSubscription>
}

export type MutationCreatePlanArgs = {
  data: PlanCreateInput
}

export type MutationCreateSnippetArgs = {
  data: SnippetCreateInput
}

export type MutationCreateUserArgs = {
  data: UserCreateInput
}

export type MutationDeleteSnippetArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>
}

export type MutationExecuteArgs = {
  data: SnippetCreateInput
  snippetId?: InputMaybe<Scalars['ID']['input']>
}

export type MutationLoginArgs = {
  data: UserLoginInput
}

export type MutationSaveSnippetArgs = {
  data: SnippetCreateInput
  id?: InputMaybe<Scalars['ID']['input']>
}

export type MutationSubscribeArgs = {
  data: UserSubscriptionCreateInput
}

export type MutationUnsubscribeArgs = {
  userId: Scalars['ID']['input']
}

export type MutationUpdatePlanArgs = {
  data: PlanUpdateInput
  id: Scalars['ID']['input']
}

export type MutationUpdateSnippetArgs = {
  data: SnippetUpdateInput
  id: Scalars['ID']['input']
}

export type MutationUpdateUserArgs = {
  data: UserUpdateInput
  id?: InputMaybe<Scalars['ID']['input']>
}

export type MutationUpdateUserSubscriptionArgs = {
  data: UserSubscriptionUpdateInput
  email: Scalars['String']['input']
}

export type Plan = {
  __typename?: 'Plan'
  createdAt: Scalars['DateTime']['output']
  executionLimit?: Maybe<Scalars['Int']['output']>
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  price: Scalars['Int']['output']
  subscriptions: Array<UserSubscription>
  updatedAt: Scalars['DateTime']['output']
}

export type PlanCreateInput = {
  executionLimit?: InputMaybe<Scalars['Int']['input']>
  name: Scalars['String']['input']
  price: Scalars['Int']['input']
}

export type PlanUpdateInput = {
  executionLimit: Scalars['Int']['input']
  name: Scalars['String']['input']
  price: Scalars['Int']['input']
}

export type Query = {
  __typename?: 'Query'
  getActiveSubscription?: Maybe<UserSubscription>
  getAllSnippets: Array<Snippet>
  getAllUsersSubscriptions: Array<User>
  getSnippet?: Maybe<Snippet>
  plans: Array<Plan>
  user?: Maybe<User>
  users: Array<User>
  whoAmI?: Maybe<User>
}

export type QueryGetActiveSubscriptionArgs = {
  userId?: InputMaybe<Scalars['String']['input']>
}

export type QueryGetSnippetArgs = {
  id: Scalars['ID']['input']
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}

export type QueryUserArgs = {
  id: Scalars['ID']['input']
}

export type Snippet = {
  __typename?: 'Snippet'
  code: Scalars['String']['output']
  createdAt: Scalars['DateTime']['output']
  executions?: Maybe<Array<Execution>>
  id: Scalars['ID']['output']
  language: Language
  name: Scalars['String']['output']
  slug: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
  user: User
}

export type SnippetCreateInput = {
  code: Scalars['String']['input']
  language: Language
  name: Scalars['String']['input']
}

export type SnippetUpdateInput = {
  code?: InputMaybe<Scalars['String']['input']>
  language?: InputMaybe<Language>
  name?: InputMaybe<Scalars['String']['input']>
}

export type User = {
  __typename?: 'User'
  createdAt: Scalars['DateTime']['output']
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  role: UserRole
  snippets: Array<Snippet>
  subscriptions: Array<UserSubscription>
  updatedAt: Scalars['DateTime']['output']
  username?: Maybe<Scalars['String']['output']>
}

export type UserCreateInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
  username: Scalars['String']['input']
}

export type UserLoginInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

/** User possible roles */
export enum UserRole {
  Admin = 'ADMIN',
  Guest = 'GUEST',
  User = 'USER',
}

export type UserSubscription = {
  __typename?: 'UserSubscription'
  cancellationReason: CancelationReadon
  expiresAt?: Maybe<Scalars['DateTime']['output']>
  id: Scalars['ID']['output']
  plan: Plan
  subscribedAt: Scalars['DateTime']['output']
  terminatedAt?: Maybe<Scalars['DateTime']['output']>
  user: User
}

export type UserSubscriptionCreateInput = {
  planId: Scalars['ID']['input']
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UserSubscriptionUpdateInput = {
  cancellationReason?: InputMaybe<Scalars['String']['input']>
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>
  terminatedAt?: InputMaybe<Scalars['DateTime']['input']>
}

export type UserUpdateInput = {
  email?: InputMaybe<Scalars['String']['input']>
  password?: InputMaybe<Scalars['String']['input']>
  username?: InputMaybe<Scalars['String']['input']>
}

export type CreateSnippetMutationVariables = Exact<{
  data: SnippetCreateInput
}>

export type CreateSnippetMutation = {
  __typename?: 'Mutation'
  createSnippet: {
    __typename?: 'Snippet'
    id: string
    name: string
    slug: string
  }
}

export type CreateUserMutationVariables = Exact<{
  data: UserCreateInput
}>

export type CreateUserMutation = {
  __typename?: 'Mutation'
  createUser: {
    __typename?: 'User'
    email?: string | null
    username?: string | null
    id: string
  }
}

export type DeleteSnippetMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type DeleteSnippetMutation = {
  __typename?: 'Mutation'
  deleteSnippet: boolean
}

export type DeletUserMutationVariables = Exact<{
  deleteUserId?: InputMaybe<Scalars['ID']['input']>
}>

export type DeletUserMutation = { __typename?: 'Mutation'; deleteUser: boolean }

export type ExecuteMutationVariables = Exact<{
  data: SnippetCreateInput
  snippetId?: InputMaybe<Scalars['ID']['input']>
}>

export type ExecuteMutation = {
  __typename?: 'Mutation'
  execute: {
    __typename?: 'Execution'
    id: string
    result: string
    status: ExecutionStatus
    snippet: {
      __typename?: 'Snippet'
      id: string
      name: string
      slug: string
      language: Language
      updatedAt: any
    }
  }
}

export type GetSnippetQueryVariables = Exact<{
  id: Scalars['ID']['input']
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}>

export type GetSnippetQuery = {
  __typename?: 'Query'
  getSnippet?: {
    __typename?: 'Snippet'
    id: string
    name: string
    code: string
    language: Language
    slug: string
    executions?: Array<{
      __typename?: 'Execution'
      id: string
      status: ExecutionStatus
      result: string
      executedAt: any
    }> | null
  } | null
}

export type GetAllSnippetsQueryVariables = Exact<{ [key: string]: never }>

export type GetAllSnippetsQuery = {
  __typename?: 'Query'
  getAllSnippets: Array<{
    __typename?: 'Snippet'
    id: string
    name: string
    slug: string
  }>
}

export type LoginMutationVariables = Exact<{
  data: UserLoginInput
}>

export type LoginMutation = {
  __typename?: 'Mutation'
  login?: { __typename?: 'User'; id: string; username?: string | null } | null
}

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = { __typename?: 'Mutation'; logout: boolean }

export type SaveSnippetMutationVariables = Exact<{
  data: SnippetCreateInput
  id: Scalars['ID']['input']
}>

export type SaveSnippetMutation = {
  __typename?: 'Mutation'
  saveSnippet?: { __typename?: 'Snippet'; id: string; slug: string } | null
}

export type UpdateSnippetMutationVariables = Exact<{
  data: SnippetUpdateInput
  updateSnippetId: Scalars['ID']['input']
}>

export type UpdateSnippetMutation = {
  __typename?: 'Mutation'
  updateSnippet: { __typename?: 'Snippet'; id: string; slug: string }
}

export type WhoAmIQueryVariables = Exact<{ [key: string]: never }>

export type WhoAmIQuery = {
  __typename?: 'Query'
  whoAmI?: {
    __typename?: 'User'
    id: string
    username?: string | null
    email?: string | null
  } | null
}

export const CreateSnippetDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateSnippet' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SnippetCreateInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createSnippet' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateSnippetMutation,
  CreateSnippetMutationVariables
>
export const CreateUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UserCreateInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'username' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>
export const DeleteSnippetDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteSnippet' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteSnippet' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteSnippetMutation,
  DeleteSnippetMutationVariables
>
export const DeletUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deletUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'deleteUserId' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'deleteUserId' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeletUserMutation, DeletUserMutationVariables>
export const ExecuteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'execute' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SnippetCreateInput' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'snippetId' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'execute' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'snippetId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'snippetId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'result' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'snippet' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'language' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExecuteMutation, ExecuteMutationVariables>
export const GetSnippetDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getSnippet' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'offset' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getSnippet' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'offset' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'offset' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'language' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'executions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'result' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'executedAt' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSnippetQuery, GetSnippetQueryVariables>
export const GetAllSnippetsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getAllSnippets' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getAllSnippets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAllSnippetsQuery, GetAllSnippetsQueryVariables>
export const LoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'login' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UserLoginInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'login' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'username' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>
export const LogoutDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'logout' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'logout' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>
export const SaveSnippetDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'saveSnippet' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SnippetCreateInput' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'saveSnippet' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SaveSnippetMutation, SaveSnippetMutationVariables>
export const UpdateSnippetDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateSnippet' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SnippetUpdateInput' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateSnippetId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateSnippet' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateSnippetId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateSnippetMutation,
  UpdateSnippetMutationVariables
>
export const WhoAmIDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'whoAmI' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'whoAmI' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'username' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<WhoAmIQuery, WhoAmIQueryVariables>
