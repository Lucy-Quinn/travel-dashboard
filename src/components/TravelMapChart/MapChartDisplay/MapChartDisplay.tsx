import { ChartRenderer } from '@/components/ChartRenderer'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { EChartsOption } from 'echarts-for-react'

interface MapChartDisplayProps {
  options: EChartsOption
  isLoading: boolean
  mapReady: boolean
}
export const MapChartDisplay = ({
  options,
  isLoading,
  mapReady,
}: MapChartDisplayProps) => {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center md:min-h-[400px] lg:min-h-[500px]">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        mapReady && <ChartRenderer options={options} className="min-h-[300px]" />
      )}
    </div>
  )
}
