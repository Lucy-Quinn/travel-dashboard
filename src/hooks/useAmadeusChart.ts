import { fetchTravelData } from '@/actions/amadeus-travel-data'
import { optionsSkeleton } from '@/constants/TravelBarChart'
import { MessageState } from '@/types/travelBarChart'
import { formatAmadeusData } from '@/utils/formatAmadeusData'
import type { EChartsOption } from 'echarts'
import { useState } from 'react'

export const useAmadeusChart = () => {
  const [options, setOptions] = useState<EChartsOption>(optionsSkeleton)
  const [message, setMessage] = useState<MessageState>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchAndUpdateChart = async (city: string): Promise<void> => {
    try {
      setIsLoading(true)
      const travelResponse = await fetchTravelData(city)

      if (!travelResponse.success) {
        setMessage({ error: 'An error occurred' })
        return
      }

      if (!travelResponse.data) {
        setMessage({ error: 'No data received' })
        return
      }

      const {
        success,
        message,
        data: { data: travelData },
      } = travelResponse

      if (!success) {
        setMessage({ error: message })
        return
      }

      const formattedOptions = formatAmadeusData({ travelData, cityOrigin: city })
      setOptions(formattedOptions)
      setMessage({ success: message })
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setMessage({ error: 'An error occurred' })
      setIsLoading(false)
    }
  }

  return { options, fetchAndUpdateChart, message, isLoading }
}
