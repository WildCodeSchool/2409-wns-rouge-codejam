import { useQuery } from '@apollo/client'

import { GET_SNIPPET } from '@/shared/api/getSnippet'

export default function useSnippet(id?: string, limit = 1, offset = 0) {
  console.log('id ', id)
  const { data, error, loading } = useQuery(GET_SNIPPET, {
    // ...(id ? { variables: { id, limit, offset } } : {}),
    variables: { id: id ?? '', limit, offset },
    skip: !id,
  })

  const { getSnippet: snippet } = data ?? {}

  return { snippet, error, loading }
}
