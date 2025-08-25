import { useQuery } from '@apollo/client'

import { GET_SNIPPET } from '@/shared/api/getSnippet'

export default function useSnippet(id?: string) {
  const { data, error, loading } = useQuery(GET_SNIPPET, {
    ...(id ? { variables: { id } } : {}),
    skip: !id,
  })

  const { getSnippet: snippet } = data ?? {}

  return { snippet, error, loading }
}
