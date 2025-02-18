import { fetchTravelData } from '@/actions/amadeus-travel-data'
import { optionsSkeleton } from '@/components/TravelBarChart/constants'
import { formatAmadeusData } from '@/utils/formatAmadeusData'
import { useState } from 'react'

export const useAmadeusChart = () => {
  const [options, setOptions] = useState(optionsSkeleton)
  const [message, setMessage] = useState<{ success?: string; error?: string } | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(false)

  const fetchAndUpdateChart = async (city: string) => {
    try {
      setIsLoading(true)
      const travelResponse = await fetchTravelData(city)

      if (!travelResponse.success) {
        setMessage({ error: 'An error occurred' })
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
