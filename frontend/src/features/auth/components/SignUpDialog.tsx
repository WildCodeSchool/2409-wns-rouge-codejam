import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import SignUpForm from './SignUpForm'
import { useState } from 'react'

const SignUpDialog = () => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="navbar-signup" variant="outline">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">Sign Up</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <SignUpForm
          callbackOnSubmit={() => {
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default SignUpDialog
