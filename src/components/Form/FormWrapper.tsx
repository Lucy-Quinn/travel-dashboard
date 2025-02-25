import { Control, FieldValues, useForm } from 'react-hook-form'
interface FormWrapperProps {
  onSubmit: (data: FieldValues) => void
  defaultValues: Record<string, string>
  children: ({ control }: { control: Control<FieldValues> }) => React.ReactNode
}

export const FormWrapper = ({ onSubmit, children, defaultValues }: FormWrapperProps) => {
  const { control, handleSubmit } = useForm<FieldValues>({
    defaultValues,
  })

  const processForm = async (data: FieldValues) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(processForm)}>
      {children({ control })}
      <button type="submit">Submit</button>
    </form>
  )
}
