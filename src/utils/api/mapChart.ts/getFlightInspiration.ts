import type { FlightDestinationPrice, ServerActionResponse } from '@/types/amadeus'
import { AmadeusAPIResponse, FlightInspiration } from '@/types/amadeus'
import { fetchFromAmadeus } from './helpers'

interface GetFlightInspirationProps {
  originCity: string
  token: string
}

export const getFlightInspiration = async ({
  originCity,
  token,
}: GetFlightInspirationProps): Promise<
  ServerActionResponse<FlightDestinationPrice[]>
> => {
  console.log(
    `[Amadeus API] Fetching flight inspiration search results from origin: ${originCity}`,
  )

  const { success, data, message } = await fetchFromAmadeus(
    `/shopping/flight-destinations?origin=${originCity}`,
    token,
    {},
    'flightInspiration',
  )

  if (!success) {
    console.error('[Amadeus API] Error fetching flight inspiration:', message)
    return { success, message }
  }

  const flightData: AmadeusAPIResponse<FlightInspiration> = data

  const flightDataWithSelectedFields = flightData.data.map(
    ({ destination, price: { total } }) => ({
      iataCode: destination,
      total,
    }),
  )

  const flightDataWithOriginAndSelectedFields = [
    { iataCode: originCity, total: 0 },
    ...flightDataWithSelectedFields,
  ]

  console.log('[Amadeus API] Flight inspiration data fetched successfully')

  return {
    success: true,
    data: flightDataWithOriginAndSelectedFields,
  }
}
