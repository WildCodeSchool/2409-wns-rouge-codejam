import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'

/**
 * Props génériques :
 * - trigger : le ReactNode (bouton, icône…) qui ouvrira la modale
 * - title / description : le titre et le texte de la modale
 * - onConfirm : callback quand l’utilisateur confirme
 * - confirmLabel / cancelLabel : textes des deux boutons
 */

export type ConfirmDialogProps = {
  trigger: React.ReactNode
  title: string
  description?: string
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Le trigger qui, quand on clique dessus, ouvrira la modale */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-md rounded-lg bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-md pt-2 text-center">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="pt-2">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Footer avec deux boutons alignés à droite */}
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false)
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
