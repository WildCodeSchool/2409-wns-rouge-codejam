import { useMutation, type ApolloError } from '@apollo/client'
import { Trash2 } from 'lucide-react'
import { DELETE_SNIPPET } from '@/shared/api/deleteSnippet'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'
import { toast } from 'sonner'

import type {
  DeleteSnippetMutation,
  DeleteSnippetMutationVariables,
} from '@/shared/gql/graphql'

/** Props du bouton de suppression : on lui passe juste l’id et le nom du snippet */
export interface DeleteSnippetButtonProps {
  snippetId: string
  snippetName: string
}
export function DeleteSnippetButton({
  snippetId,
  snippetName,
}: DeleteSnippetButtonProps) {
  // Mutation Apollo pour supprimer le snippet
  const mutation = useMutation<
    DeleteSnippetMutation,
    DeleteSnippetMutationVariables
  >(DELETE_SNIPPET, {
    variables: { id: snippetId },
    update(cache, { data }) {
      if (data?.deleteSnippet) {
        // Éviction de l’objet Snippet du cache Apollo
        cache.evict({
          id: cache.identify({ __typename: 'Snippet', id: snippetId }),
        })
        cache.gc() // nettoyage des références orphelines
      }
    },
    onError(error: ApolloError) {
      let userMessage =
        'Une erreur est survenue lors de la suppression du snippet.'

      // Erreurs GraphQL
      if (
        Array.isArray(error.graphQLErrors) &&
        error.graphQLErrors.length > 0
      ) {
        const gqlErrors = error.graphQLErrors as readonly {
          message: string
        }[]
        const msg = gqlErrors[0].message.replace(/^GraphQL error: /, '')
        userMessage += ` Détail : ${msg}`
      }
      // Erreur réseau
      else if (error.networkError) {
        userMessage += ' Problème de connexion réseau.'
      }

      toast.error(userMessage)
    },
  })

  // Typage sûr de la fonction deleteSnippet
  const deleteSnippet = (): Promise<void> => mutation[0]().then(() => void 0)
  const loading = mutation[1].loading

  return (
    <ConfirmDialog
      trigger={
        <button
          aria-label={`Supprimer ${snippetName}`}
          disabled={loading}
          className="text-destructive hover:text-destructive-foreground cursor-pointer rounded p-2 transition focus:ring-2 focus:outline-none focus-visible:ring-2 disabled:pointer-events-none"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      }
      title={`Supprimer le snippet « ${snippetName} » ?`}
      description="Cette action est irréversible."
      // Quand on confirme : on lance la mutation
      onConfirm={() => void deleteSnippet()}
      confirmLabel="Supprimer"
      cancelLabel="Annuler"
    />
  )
}

export default DeleteSnippetButton
