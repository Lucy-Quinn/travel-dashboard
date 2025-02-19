import { optionsSkeleton } from '@/constants/TravelBarChart'
import type { AmadeusDestinationRecommendation } from '@/types/amadeus'
interface formatAmadeusDataProps {
  travelData: AmadeusDestinationRecommendation[]
  cityOrigin: string
}

export const formatAmadeusData = ({ travelData, cityOrigin }: formatAmadeusDataProps) => {
  const newOptions = JSON.parse(JSON.stringify(optionsSkeleton))

  return travelData.reduce((acc, curr, index) => {
    const { name, relevance } = curr
    acc.xAxis.data.push(name)
    acc.series[0].data.push(Math.round(relevance * 100))
    if (index === travelData.length - 1) {
      acc.title.text = `Recommended Destinations From ${cityOrigin}`
    }
    return acc
  }, newOptions)
}
