import { placeholder } from '@/constants/TravelBarChart'
import { FieldValues, useForm } from 'react-hook-form'
import { ControlledSelect } from './ControlledSelect'
import { FeedbackMessage } from './FeedbackMessage'
interface FormProps {
  onSubmit: (city: string) => void
  message?: { success?: string; error?: string }
}

export const Form = ({ onSubmit, message }: FormProps) => {
  const { control, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      cities: placeholder,
    },
  })

  const processForm = async (data: FieldValues) => {
    onSubmit(data.cities)
  }

  return (
    <form onSubmit={handleSubmit(processForm)}>
      <ControlledSelect
        control={control}
        handleSubmit={handleSubmit}
        processForm={processForm}
      />
      <FeedbackMessage message={message} />
    </form>
  )
}
