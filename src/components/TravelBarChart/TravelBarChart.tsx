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
import { FieldValues } from 'react-hook-form'

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
          {({ control }) => (
            <>
              <ControlledSelect
                control={control}
                options={CITY_OPTIONS}
                placeholder={CITY_OPTIONS_PLACEHOLDER}
                name="city"
              />
              <FeedbackMessage message={message} />
            </>
          )}
        </FormWrapper>
        <div className="relative mt-6 min-h-[500px] w-full">
          {isLoading ? (
            <LoadingSpinner />
          ) : showChart ? (
            <ReactECharts option={options} style={{ height: '500px', width: '100%' }} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}
