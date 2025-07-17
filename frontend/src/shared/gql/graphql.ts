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
}

/** Supported programming languages */
export enum Language {
  Javascript = 'JAVASCRIPT',
  Typescript = 'TYPESCRIPT',
}

export type Mutation = {
  __typename?: 'Mutation'
  createSnippet: Snippet
  createUser?: Maybe<User>
  deleteSnippet: Scalars['Boolean']['output']
  deleteUser: Scalars['Boolean']['output']
  execute: Execution
  login?: Maybe<User>
  logout: Scalars['Boolean']['output']
  updateSnippet: Snippet
  updateUser?: Maybe<User>
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

export type MutationUpdateSnippetArgs = {
  data: SnippetUpdateInput
  id: Scalars['ID']['input']
}

export type MutationUpdateUserArgs = {
  data: UserUpdateInput
  id?: InputMaybe<Scalars['ID']['input']>
}

export type Query = {
  __typename?: 'Query'
  getAllSnippets: Array<Snippet>
  getSnippet?: Maybe<Snippet>
  user?: Maybe<User>
  users: Array<User>
  whoAmI?: Maybe<User>
}

export type QueryGetSnippetArgs = {
  id: Scalars['ID']['input']
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
  language: Scalars['String']['input']
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

export type UserUpdateInput = {
  email?: InputMaybe<Scalars['String']['input']>
  password?: InputMaybe<Scalars['String']['input']>
  username?: InputMaybe<Scalars['String']['input']>
}

export type CreateUserMutationVariables = Exact<{
  data: UserCreateInput
}>

export type CreateUserMutation = {
  __typename?: 'Mutation'
  createUser?: {
    __typename?: 'User'
    email?: string | null
    username?: string | null
    id: string
  } | null
}

export type MutationMutationVariables = Exact<{
  data: SnippetCreateInput
  snippetId?: InputMaybe<Scalars['ID']['input']>
}>

export type MutationMutation = {
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

export type LoginMutationVariables = Exact<{
  data: UserLoginInput
}>

export type LoginMutation = {
  __typename?: 'Mutation'
  login?: { __typename?: 'User'; id: string; username?: string | null } | null
}

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = { __typename?: 'Mutation'; logout: boolean }

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
export const MutationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Mutation' },
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
} as unknown as DocumentNode<MutationMutation, MutationMutationVariables>
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
