import { Button } from '@/shared/components/ui/button'

import { Eye, EyeClosed } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Control } from 'react-hook-form'

type PasswordVisibiltyFormFieldPropsType = {
  formName: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formControl: Control<any>
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}

const PasswordVisibiltyFormField = (
  props: PasswordVisibiltyFormFieldPropsType,
) => {
  return (
    <FormField
      control={props.formControl}
      name={props.formName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.name}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                aria-label={props.name}
                className="w-full"
                type={props.isVisible ? 'text' : 'password'}
                {...field}
              />
              <Button
                aria-label={props.isVisible ? 'Hide password' : 'Show password'}
                className="absolute top-0 right-0 border-none bg-transparent shadow-none hover:bg-transparent"
                variant="outline"
                onClick={() => {
                  props.setIsVisible(!props.isVisible)
                }}
              >
                <span>
                  {props.isVisible ? (
                    <Eye aria-hidden="false" role="img" size={15} />
                  ) : (
                    <EyeClosed aria-hidden="false" role="img" size={15} />
                  )}
                </span>
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default PasswordVisibiltyFormField
