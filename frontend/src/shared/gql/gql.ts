/* eslint-disable */
import * as types from './graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  mutation CreateSnippet($data: SnippetCreateInput!) {\n    createSnippet(data: $data) {\n      id\n      name\n      slug\n    }\n  }\n': typeof types.CreateSnippetDocument
  '\n  mutation createUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      email\n      username\n      id\n    }\n  }\n': typeof types.CreateUserDocument
  '\n  mutation deleteSnippet($id: ID!) {\n    deleteSnippet(id: $id)\n  }\n': typeof types.DeleteSnippetDocument
  '\n  mutation deletUser($deleteUserId: ID) {\n    deleteUser(id: $deleteUserId)\n  }\n': typeof types.DeletUserDocument
  '\n  mutation execute($data: SnippetCreateInput!, $snippetId: ID) {\n    execute(data: $data, snippetId: $snippetId) {\n      id\n      result\n      status\n      snippet {\n        id\n        name\n        slug\n        language\n        updatedAt\n      }\n    }\n  }\n': typeof types.ExecuteDocument
  '\n  query getSnippet($id: ID!, $limit: Int, $offset: Int) {\n    getSnippet(id: $id, limit: $limit, offset: $offset) {\n      id\n      name\n      code\n      language\n      slug\n      executions {\n        id\n        status\n        result\n        executedAt\n      }\n    }\n  }\n': typeof types.GetSnippetDocument
  '\n  query getAllSnippets {\n    getAllSnippets {\n      id\n      name\n      slug\n    }\n  }\n': typeof types.GetAllSnippetsDocument
  '\n  mutation login($data: UserLoginInput!) {\n    login(data: $data) {\n      id\n      username\n    }\n  }\n': typeof types.LoginDocument
  '\n  mutation logout {\n    logout\n  }\n': typeof types.LogoutDocument
  '\n  mutation saveSnippet($data: SnippetCreateInput!, $id: ID!) {\n    saveSnippet(data: $data, id: $id) {\n      id\n      slug\n    }\n  }\n': typeof types.SaveSnippetDocument
  '\n  mutation UpdateSnippet($data: SnippetUpdateInput!, $updateSnippetId: ID!) {\n    updateSnippet(data: $data, id: $updateSnippetId) {\n      id\n      slug\n    }\n  }\n': typeof types.UpdateSnippetDocument
  '\n  query whoAmI {\n    whoAmI {\n      id\n      username\n      email\n    }\n  }\n': typeof types.WhoAmIDocument
}
const documents: Documents = {
  '\n  mutation CreateSnippet($data: SnippetCreateInput!) {\n    createSnippet(data: $data) {\n      id\n      name\n      slug\n    }\n  }\n':
    types.CreateSnippetDocument,
  '\n  mutation createUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      email\n      username\n      id\n    }\n  }\n':
    types.CreateUserDocument,
  '\n  mutation deleteSnippet($id: ID!) {\n    deleteSnippet(id: $id)\n  }\n':
    types.DeleteSnippetDocument,
  '\n  mutation deletUser($deleteUserId: ID) {\n    deleteUser(id: $deleteUserId)\n  }\n':
    types.DeletUserDocument,
  '\n  mutation execute($data: SnippetCreateInput!, $snippetId: ID) {\n    execute(data: $data, snippetId: $snippetId) {\n      id\n      result\n      status\n      snippet {\n        id\n        name\n        slug\n        language\n        updatedAt\n      }\n    }\n  }\n':
    types.ExecuteDocument,
  '\n  query getSnippet($id: ID!, $limit: Int, $offset: Int) {\n    getSnippet(id: $id, limit: $limit, offset: $offset) {\n      id\n      name\n      code\n      language\n      slug\n      executions {\n        id\n        status\n        result\n        executedAt\n      }\n    }\n  }\n':
    types.GetSnippetDocument,
  '\n  query getAllSnippets {\n    getAllSnippets {\n      id\n      name\n      slug\n    }\n  }\n':
    types.GetAllSnippetsDocument,
  '\n  mutation login($data: UserLoginInput!) {\n    login(data: $data) {\n      id\n      username\n    }\n  }\n':
    types.LoginDocument,
  '\n  mutation logout {\n    logout\n  }\n': types.LogoutDocument,
  '\n  mutation saveSnippet($data: SnippetCreateInput!, $id: ID!) {\n    saveSnippet(data: $data, id: $id) {\n      id\n      slug\n    }\n  }\n':
    types.SaveSnippetDocument,
  '\n  mutation UpdateSnippet($data: SnippetUpdateInput!, $updateSnippetId: ID!) {\n    updateSnippet(data: $data, id: $updateSnippetId) {\n      id\n      slug\n    }\n  }\n':
    types.UpdateSnippetDocument,
  '\n  query whoAmI {\n    whoAmI {\n      id\n      username\n      email\n    }\n  }\n':
    types.WhoAmIDocument,
}

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation CreateSnippet($data: SnippetCreateInput!) {\n    createSnippet(data: $data) {\n      id\n      name\n      slug\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateSnippet($data: SnippetCreateInput!) {\n    createSnippet(data: $data) {\n      id\n      name\n      slug\n    }\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation createUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      email\n      username\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation createUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      email\n      username\n      id\n    }\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation deleteSnippet($id: ID!) {\n    deleteSnippet(id: $id)\n  }\n',
): (typeof documents)['\n  mutation deleteSnippet($id: ID!) {\n    deleteSnippet(id: $id)\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation deletUser($deleteUserId: ID) {\n    deleteUser(id: $deleteUserId)\n  }\n',
): (typeof documents)['\n  mutation deletUser($deleteUserId: ID) {\n    deleteUser(id: $deleteUserId)\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation execute($data: SnippetCreateInput!, $snippetId: ID) {\n    execute(data: $data, snippetId: $snippetId) {\n      id\n      result\n      status\n      snippet {\n        id\n        name\n        slug\n        language\n        updatedAt\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation execute($data: SnippetCreateInput!, $snippetId: ID) {\n    execute(data: $data, snippetId: $snippetId) {\n      id\n      result\n      status\n      snippet {\n        id\n        name\n        slug\n        language\n        updatedAt\n      }\n    }\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getSnippet($id: ID!, $limit: Int, $offset: Int) {\n    getSnippet(id: $id, limit: $limit, offset: $offset) {\n      id\n      name\n      code\n      language\n      slug\n      executions {\n        id\n        status\n        result\n        executedAt\n      }\n    }\n  }\n',
): (typeof documents)['\n  query getSnippet($id: ID!, $limit: Int, $offset: Int) {\n    getSnippet(id: $id, limit: $limit, offset: $offset) {\n      id\n      name\n      code\n      language\n      slug\n      executions {\n        id\n        status\n        result\n        executedAt\n      }\n    }\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getAllSnippets {\n    getAllSnippets {\n      id\n      name\n      slug\n    }\n  }\n',
): (typeof documents)['\n  query getAllSnippets {\n    getAllSnippets {\n      id\n      name\n      slug\n    }\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation login($data: UserLoginInput!) {\n    login(data: $data) {\n      id\n      username\n    }\n  }\n',
): (typeof documents)['\n  mutation login($data: UserLoginInput!) {\n    login(data: $data) {\n      id\n      username\n    }\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation logout {\n    logout\n  }\n',
): (typeof documents)['\n  mutation logout {\n    logout\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation saveSnippet($data: SnippetCreateInput!, $id: ID!) {\n    saveSnippet(data: $data, id: $id) {\n      id\n      slug\n    }\n  }\n',
): (typeof documents)['\n  mutation saveSnippet($data: SnippetCreateInput!, $id: ID!) {\n    saveSnippet(data: $data, id: $id) {\n      id\n      slug\n    }\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation UpdateSnippet($data: SnippetUpdateInput!, $updateSnippetId: ID!) {\n    updateSnippet(data: $data, id: $updateSnippetId) {\n      id\n      slug\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateSnippet($data: SnippetUpdateInput!, $updateSnippetId: ID!) {\n    updateSnippet(data: $data, id: $updateSnippetId) {\n      id\n      slug\n    }\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query whoAmI {\n    whoAmI {\n      id\n      username\n      email\n    }\n  }\n',
): (typeof documents)['\n  query whoAmI {\n    whoAmI {\n      id\n      username\n      email\n    }\n  }\n']

export function gql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
