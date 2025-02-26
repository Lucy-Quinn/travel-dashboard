'use client'
import { EmptyState } from '@/components/EmptyState'
import { FormWrapper } from '@/components/Form'
import { ControlledSelect } from '@/components/Form/ControlledSelect'
import { FeedbackMessage } from '@/components/Form/FeedbackMessage'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { CITY_OPTIONS, CITY_OPTIONS_PLACEHOLDER } from '@/constants/travelChart'
import { useAmadeusBarChart } from '@/hooks/useAmadeusBarChart'
import ReactECharts from 'echarts-for-react'
import { useState } from 'react'
import type { FieldValues } from 'react-hook-form'

export const TravelBarChart = () => {
  const { options, fetchAndUpdateBarChart, message, isLoading } = useAmadeusBarChart()
  const [showChart, setShowChart] = useState<boolean>(false)

  const loadChartData = async (data: FieldValues): Promise<void> => {
    try {
      await fetchAndUpdateBarChart(data)
      setShowChart(true)
    } catch (error) {
      console.error('Error in loadChartData:', error)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-3">
      <div className="rounded-lg bg-white">
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
        <div className="relative flex min-h-[300px] w-full items-center justify-center max-sm:mt-5 md:min-h-[400px] md:items-center lg:min-h-[500px]">
          {isLoading ? (
            <LoadingSpinner />
          ) : showChart && !message?.error ? (
            <ReactECharts
              option={options}
              className="min-h-[450px] w-full md:min-h-[500px]"
              style={{ height: '100%', width: '100%', marginTop: '20px' }}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}
