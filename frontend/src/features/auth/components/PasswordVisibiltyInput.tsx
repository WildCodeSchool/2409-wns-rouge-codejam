import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form'

import { SignUpFormType } from '@/features/auth/schemas'

import { Button } from '@/shared/components/ui/button'
import { FormControl } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'

type PasswordVisibiltyInputProps = React.ComponentProps<'input'> & {
  onChange?: (e: React.FormEvent<HTMLElement>) => void
  field?: Omit<
    ControllerRenderProps<SignUpFormType, keyof SignUpFormType>,
    'onChange'
  >
}

const PasswordVisibiltyInput = ({
  onChange,
  field,
  ...restProps
}: PasswordVisibiltyInputProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  return (
    <div className="relative">
      <FormControl onChange={onChange}>
        <Input
          className="w-full pr-10"
          type={isVisible ? 'text' : 'password'}
          {...field}
          {...restProps}
        />
      </FormControl>
      <Button
        type="button"
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        className="absolute top-0 right-0 border-none bg-transparent shadow-none hover:bg-transparent"
        variant="outline"
        onClick={() => {
          setIsVisible(!isVisible)
        }}
      >
        {isVisible ? (
          <Eye aria-hidden="true" size={15} />
        ) : (
          <EyeClosed aria-hidden="true" size={15} />
        )}
      </Button>
    </div>
  )
}

export default PasswordVisibiltyInput
