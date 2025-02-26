import { CITY_OPTIONS } from '@/constants/travelChart'

import { ControlledSelect } from '@/components/Form/ControlledSelect'
import { FeedbackMessage } from '@/components/Form/FeedbackMessage'
import { FormWrapper } from '@/components/Form/FormWrapper'
import { CITY_OPTIONS_PLACEHOLDER } from '@/constants/travelChart'
import type { MessageState } from '@/types/travelChart'
import type { FieldValues } from 'react-hook-form'

interface BarChartFormProps {
  fetchAndUpdateBarChart: (data: FieldValues) => Promise<void>
  message: MessageState
  setShowChart: (showChart: boolean) => void
}

export const BarChartForm = ({
  fetchAndUpdateBarChart,
  message,
  setShowChart,
}: BarChartFormProps) => {
  const loadChartData = async (data: FieldValues): Promise<void> => {
    try {
      await fetchAndUpdateBarChart(data)
      setShowChart(true)
    } catch (error) {
      console.error('Error in loadChartData:', error)
    }
  }
  return (
    <FormWrapper
      onSubmit={loadChartData}
      defaultValues={{
        city: CITY_OPTIONS_PLACEHOLDER,
      }}
    >
      {({ control, handleSubmit, processForm }) => (
        <div>
          <div className="sm:w-4/12 md:m-auto md:w-1/2 lg:m-0 lg:ml-auto xl:text-lg">
            <ControlledSelect
              handleSubmit={handleSubmit}
              processForm={processForm}
              control={control}
              options={CITY_OPTIONS}
              placeholder={CITY_OPTIONS_PLACEHOLDER}
              name="city"
            />
          </div>
          <FeedbackMessage message={message} />
        </div>
      )}
    </FormWrapper>
  )
}
