'use client'
import { useAmadeusChart } from '@/hooks/useAmadeusChart'
import ReactECharts from 'echarts-for-react'
import { BarChart } from 'echarts/charts'
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useState } from 'react'
import { EmptyState } from './EmptyState'
import { Form } from './Form'
import { LoadingSpinner } from './LoadingSpinner'

echarts.use([BarChart, GridComponent, TitleComponent, TooltipComponent, CanvasRenderer])

export const TravelBarChart = ({ className }: { className?: string }) => {
  const { options, fetchAndUpdateChart, message, isLoading } = useAmadeusChart()
  const [showChart, setShowChart] = useState<boolean>(false)

  const handleCitySubmit = async (city: string): Promise<void> => {
    await fetchAndUpdateChart(city)
    setShowChart(true)
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4 lg:p-6">
      <div className="rounded-lg bg-white p-4 lg:p-6">
        <Form onSubmit={handleCitySubmit} message={message} />
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
