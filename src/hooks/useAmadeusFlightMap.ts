import { fetchFlightInspiration } from '@/actions/flight-inspiration'
import { mapChartSchema } from '@/schemas/charts'
import type { MessageState } from '@/types/travelChart'
import { formatFlightMap } from '@/utils/formatters/charts/mapChartFormatter'
import type { EChartsOption } from 'echarts'
import { useState } from 'react'
import { FieldValues } from 'react-hook-form'

export const useAmadeusFlightMap = () => {
  const [options, setOptions] = useState<EChartsOption>(mapChartSchema)
  const [message, setMessage] = useState<MessageState>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchAndUpdateFlightMap = async (location: FieldValues): Promise<void> => {
    const { city, airport } = location
    const departureLocation = airport ? airport : city
    try {
      setIsLoading(true)
      const flightInspirationResponse = await fetchFlightInspiration(city, airport!)

      if (!flightInspirationResponse.success) {
        setMessage({
          error: `Failed to fetch flight prices for ${departureLocation}. Please try again in a few moments.`,
        })
        setIsLoading(false)
        return
      }

      if (!flightInspirationResponse.data) {
        setMessage({
          error: `No flight deals found for ${departureLocation}. Try searching for a different city.`,
        })
        setIsLoading(false)
        return
      }

      const { success, message, data: flightData } = flightInspirationResponse

      if (!success) {
        setMessage({ error: message })
        setIsLoading(false)
        return
      }

      const formattedOptions = formatFlightMap({
        flightData,
        cityOrigin: departureLocation,
      })

      setOptions(formattedOptions)
      setMessage({ success: message })
    } catch (error) {
      console.error('Error:', error)
      setMessage({ error: 'An error occurred' })
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return { options, fetchAndUpdateFlightMap, message, isLoading }
}
