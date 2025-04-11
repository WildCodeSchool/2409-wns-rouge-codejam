import { useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form'
import { Eye, EyeClosed } from 'lucide-react'
import { SignUpFormType } from '@/features/auth/schemas/formSchema'
import { Button } from '@/shared/components/ui/button'
import { FormControl } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'

type PasswordVisibiltyInputProps = {
  onChange?: (e: React.FormEvent<HTMLElement>) => void
  disabled?: boolean
  field?: Omit<
    ControllerRenderProps<SignUpFormType, keyof SignUpFormType>,
    'onChange'
  >
}

const PasswordVisibiltyInput = ({
  onChange,
  disabled,
  field,
}: PasswordVisibiltyInputProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  return (
    <div className="relative">
      <FormControl onChange={onChange}>
        <Input
          data-testid="custom-password-field"
          className="w-full"
          type={isVisible ? 'text' : 'password'}
          disabled={disabled}
          {...field}
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
          <Eye aria-hidden="true" role="img" size={15} />
        ) : (
          <EyeClosed aria-hidden="true" role="img" size={15} />
        )}
      </Button>
    </div>
  )
}

export default PasswordVisibiltyInput
