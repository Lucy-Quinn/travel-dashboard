import { CITY_OPTIONS } from '@/constants/TravelBarChart'
import { travelBarChartSchema } from '@/schemas/charts'
import type { AmadeusDestinationRecommendation } from '@/types/amadeus'
import type { CityOptionsKey } from '@/types/travelBarChart'

const generateTitleText = (cityOrigin: string, isMobile: boolean = false) => {
  const cityName = CITY_OPTIONS[cityOrigin as CityOptionsKey]
  const baseText = 'Recommended Destinations From'
  return isMobile ? `${baseText}\n${cityName}` : `${baseText} ${cityName}`
}

interface formatAmadeusDataProps {
  travelData: AmadeusDestinationRecommendation[]
  cityOrigin: string
}

export const formatAmadeusData = ({ travelData, cityOrigin }: formatAmadeusDataProps) => {
  const newOptions = JSON.parse(JSON.stringify(travelBarChartSchema))

  return travelData.reduce((acc, curr, index) => {
    const { name, relevance } = curr
    acc.xAxis.data.push(name)
    acc.series[0].data.push(Math.round(relevance * 100))
    if (index === travelData.length - 1) {
      acc.title.text = generateTitleText(cityOrigin)
      acc.media[0].option.title.text = generateTitleText(cityOrigin, true)
    }
    return acc
  }, newOptions)
}
