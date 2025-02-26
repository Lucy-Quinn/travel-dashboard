import { ChartRenderer } from '@/components/ChartRenderer'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { EChartsOption } from 'echarts-for-react'

interface GeoChartDisplayProps {
  options: EChartsOption
  isLoading: boolean
  mapReady: boolean
}
export const GeoChartDisplay = ({
  options,
  isLoading,
  mapReady,
}: GeoChartDisplayProps) => {
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
