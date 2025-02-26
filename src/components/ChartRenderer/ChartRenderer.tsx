import clsx from 'clsx'
import ReactECharts, { type EChartsOption } from 'echarts-for-react'

interface ChartRendererProps {
  options: EChartsOption
  className?: string
}
export const ChartRenderer = ({ options, className }: ChartRendererProps) => {
  return (
    <ReactECharts
      option={options}
      className={clsx('w-full md:min-h-[500px]', className)}
      style={{ height: '100%', width: '100%', marginTop: '20px' }}
    />
  )
}
