import { Button } from '@/shared/components/ui/button'
import { Eye, EyeClosed } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { ControllerRenderProps } from 'react-hook-form'
import { useState } from 'react'
import { SignUpFormType } from '@/features/auth/components/SignUpForm'

type PasswordVisibiltyInputPropsType = {
  field?: ControllerRenderProps<SignUpFormType>
  name: string
}

const PasswordVisibiltyInput = (props: PasswordVisibiltyInputPropsType) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  return (
    <div className="relative">
      <Input
        data-testid="custom-password-field"
        aria-label={props.name}
        className="w-full"
        type={isVisible ? 'text' : 'password'}
        {...props.field}
      />
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
