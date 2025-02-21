'use client'
import { useAmadeusBarChart } from '@/hooks/useAmadeusBarChart'
import ReactECharts from 'echarts-for-react'
import { useState } from 'react'
import { EmptyState } from './EmptyState'
import { Form } from './Form'
import { LoadingSpinner } from './LoadingSpinner'

export const TravelBarChart = ({ className }: { className?: string }) => {
  const { options, fetchAndUpdateBarChart, message, isLoading } = useAmadeusBarChart()
  const [showChart, setShowChart] = useState<boolean>(false)

  const loadChartData = async (city: string): Promise<void> => {
    await fetchAndUpdateBarChart(city)
    setShowChart(true)
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-3">
      <div className="rounded-lg bg-white">
        <Form onSubmit={loadChartData} message={message} />
        <div className={`relative mt-6 min-h-[500px] w-full ${className || ''}`}>
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
