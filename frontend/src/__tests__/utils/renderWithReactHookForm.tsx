import { ReactElement } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render } from '@testing-library/react'

export const renderWithReactHookForm = (
  formComponent: ReactElement,
  { defaultValues = {} } = {},
) => {
  const Wrapper = ({ children }: React.PropsWithChildren) => {
    const methods = useForm({ defaultValues })
    return <FormProvider {...methods}>{children}</FormProvider>
  }

  return {
    ...render(formComponent, { wrapper: Wrapper }),
  }
}
