'use client'
import { useAmadeusBarChart } from '@/hooks/useAmadeusBarChart'
import { useState } from 'react'
import { BarChartDisplay } from './BarChartDisplay'
import { BarChartForm } from './BarChartForm/Form'

export const TravelBarChart = () => {
  const { options, fetchAndUpdateBarChart, message, isLoading } = useAmadeusBarChart()
  const [showChart, setShowChart] = useState<boolean>(false)

  return (
    <div className="mx-auto w-full max-w-4xl p-3">
      <div className="rounded-lg bg-white">
        <BarChartForm
          fetchAndUpdateBarChart={fetchAndUpdateBarChart}
          message={message}
          setShowChart={setShowChart}
        />
        <BarChartDisplay
          options={options}
          isLoading={isLoading}
          showChart={showChart}
          message={message}
        />
      </div>
    </div>
  )
}
