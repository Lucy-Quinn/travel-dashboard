import { fetchFlightInspiration } from '@/actions/flight-inspiration'
import { mapChartSchema } from '@/schemas/charts'
import type { MessageState } from '@/types/travelBarChart'
import { formatFlightMap } from '@/utils/formatters/charts/mapChartFormatter'
import type { EChartsOption } from 'echarts'
import { useState } from 'react'

export const useAmadeusFlightMap = () => {
  const [options, setOptions] = useState<EChartsOption>(mapChartSchema)
  const [message, setMessage] = useState<MessageState>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchAndUpdateFlightMap = async (city: string): Promise<void> => {
    try {
      setIsLoading(true)
      const flightInspirationResponse = await fetchFlightInspiration()

      if (!flightInspirationResponse.success) {
        setMessage({ error: 'An error occurred' })
        return
      }

      if (!flightInspirationResponse.data) {
        setMessage({ error: 'No data received' })
        return
      }

      const { success, message, data: flightData } = flightInspirationResponse

      if (!success) {
        setMessage({ error: message })
        return
      }

      const formattedOptions = formatFlightMap({ flightData, cityOrigin: city })
      setOptions(formattedOptions)
      setMessage({ success: message })
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setMessage({ error: 'An error occurred' })
      setIsLoading(false)
    }
  }

  return { options, fetchAndUpdateFlightMap, message, isLoading }
}
