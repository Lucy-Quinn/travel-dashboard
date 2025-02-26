import { ChartRenderer } from '@/components/ChartRenderer'
import { EmptyState } from '@/components/EmptyState'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import type { MessageState } from '@/types/travelChart'
import type { EChartsOption } from 'echarts-for-react'

interface BarChartDisplayProps {
  options: EChartsOption
  isLoading: boolean
  showChart: boolean
  message: MessageState
}
export const BarChartDisplay = ({
  options,
  isLoading,
  showChart,
  message,
}: BarChartDisplayProps) => {
  return (
    <div className="relative flex min-h-[300px] w-full items-center justify-center max-sm:mt-5 md:min-h-[400px] md:items-center lg:min-h-[500px]">
      {isLoading ? (
        <LoadingSpinner />
      ) : showChart && !message?.error ? (
        <ChartRenderer options={options} className="min-h-[450px]" />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
