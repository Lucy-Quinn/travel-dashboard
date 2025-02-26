import { CITY_OPTIONS } from '@/constants/travelChart'
import { barChartSchema } from '@/schemas/charts'
import type { DestinationRecommendation } from '@/types/amadeus'

const generateBarChartTitleText = (cityOrigin: string, isMobile: boolean = false) => {
  const cityName = CITY_OPTIONS[cityOrigin as keyof typeof CITY_OPTIONS]
  const baseText = 'Recommended destinations'
  return isMobile ? `${baseText}\nfrom ${cityName}` : `${baseText} from ${cityName}`
}

interface FormatDestinationBarChartProps {
  travelData: DestinationRecommendation[]
  cityOrigin: string
}

export const formatDestinationBarChart = ({
  travelData,
  cityOrigin,
}: FormatDestinationBarChartProps) => {
  const barChartSchemaOptions = JSON.parse(JSON.stringify(barChartSchema))

  return travelData.reduce((acc, curr, index) => {
    const { name, relevance } = curr
    acc.xAxis.data.push(name)
    acc.series[0].data.push(Math.round(relevance * 100))
    if (index === travelData.length - 1) {
      acc.title.text = generateBarChartTitleText(cityOrigin)
      acc.media[0].option.title.text = generateBarChartTitleText(cityOrigin, true)
    }
    return acc
  }, barChartSchemaOptions)
}
