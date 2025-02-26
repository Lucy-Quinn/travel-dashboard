import { Control, type FieldValues, useForm, UseFormHandleSubmit } from 'react-hook-form'

interface FormWrapperProps {
  onSubmit: (data: FieldValues) => void
  defaultValues: Record<string, string>
  children: ({
    control,
    handleSubmit,
    processForm,
  }: {
    control: Control<FieldValues>
    handleSubmit: UseFormHandleSubmit<FieldValues>
    processForm: (data: FieldValues) => void
  }) => React.ReactNode
}

export const FormWrapper = ({ onSubmit, children, defaultValues }: FormWrapperProps) => {
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues,
  })

  const processForm = async (data: FieldValues) => {
    onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(processForm)}>
      {children({ control, handleSubmit, processForm })}
    </form>
  )
}
