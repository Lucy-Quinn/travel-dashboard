import { CITY_OPTIONS } from '@/constants/travelChart'
import { barChartSchema } from '@/schemas/charts'
import type { DestinationRecommendation } from '@/types/amadeus'
import type { EChartsOption } from 'echarts'
import { generateChartHeadingText } from '../helpers'

export interface FormatDestinationBarChartProps {
  travelData: DestinationRecommendation[]
  city: string
}

export const formatDestinationBarChart = ({
  travelData,
  city,
}: FormatDestinationBarChartProps): EChartsOption => {
  const barChartSchemaOptions = JSON.parse(JSON.stringify(barChartSchema))
  const cityName = CITY_OPTIONS[city as keyof typeof CITY_OPTIONS]

  if (!travelData || travelData.length === 0 || !city || !cityName)
    return barChartSchemaOptions

  const baseText = 'Recommended destinations'

  barChartSchemaOptions.title.text = generateChartHeadingText({
    cityName,
    baseText,
  })
  barChartSchemaOptions.media[0].option.title.text = generateChartHeadingText({
    cityName,
    baseText,
    isMobile: true,
  })

  return travelData.reduce((acc, curr) => {
    const { name, relevance } = curr
    acc.xAxis.data.push(name)
    acc.series[0].data.push(Math.round(relevance * 100))
    return acc
  }, barChartSchemaOptions)
}
