import { fetchRecommendedDestinations } from '@/actions/recommended-destinations'
import { barChartSchema } from '@/schemas/charts'
import type { MessageState } from '@/types/travelBarChart'
import { formatDestinationBarChart } from '@/utils/formatters/charts/barChartFormatter'
import type { EChartsOption } from 'echarts'
import { useState } from 'react'

export const useAmadeusBarChart = () => {
  const [options, setOptions] = useState<EChartsOption>(barChartSchema)
  const [message, setMessage] = useState<MessageState>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchAndUpdateBarChart = async (city: string): Promise<void> => {
    try {
      setIsLoading(true)
      const travelResponse = await fetchRecommendedDestinations(city)

      if (!travelResponse.success) {
        setMessage({
          error: `Failed to fetch recommended destinations for ${city}. Please try again in a few moments.`,
        })
        return
      }

      if (!travelResponse.data) {
        setMessage({
          error: `No recommended destinations found for ${city}. Try searching for a different city.`,
        })
        return
      }

      const { success, message, data: travelData } = travelResponse

      if (!success) {
        setMessage({ error: message })
        return
      }

      const formattedOptions = formatDestinationBarChart({
        travelData,
        cityOrigin: city,
      })
      setOptions(formattedOptions)
      setMessage({ success: message })
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setMessage({ error: 'An error occurred' })
      setIsLoading(false)
    }
  }

  return { options, fetchAndUpdateBarChart, message, isLoading }
}
