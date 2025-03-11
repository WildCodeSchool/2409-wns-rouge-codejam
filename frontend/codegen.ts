import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://backend:3000/graphql',
  documents: ['./src/shared/api/*.ts'],
  generates: {
    './src/shared/gql/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  watch: true,
}
export default config
