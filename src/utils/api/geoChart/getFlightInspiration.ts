import type {
  AmadeusAPIResponse,
  FlightDestinationPrice,
  FlightInspiration,
  ServerActionResponse,
} from '@/types/amadeus'
import { AMADEUS_ENDPOINTS, fetchFromAmadeus } from '../helpers'

interface GetFlightInspirationProps {
  city: string
  airport: string
  token: string
}

export const getFlightInspiration = async ({
  city,
  airport,
  token,
}: GetFlightInspirationProps): Promise<
  ServerActionResponse<FlightDestinationPrice[]>
> => {
  console.log(
    `[Amadeus API] Fetching flight inspiration search results from origin: ${city}`,
  )

  const { success, data, message } = await fetchFromAmadeus(
    `/shopping/flight-destinations?origin=${city}`,
    token,
    {},
    AMADEUS_ENDPOINTS.FLIGHT_INSPIRATION,
  )

  if (!success) {
    console.error('[Amadeus API] Error fetching flight inspiration:', message)
    return { success, message }
  }

  const flightData: AmadeusAPIResponse<FlightInspiration> = data

  if (airport) {
    flightData.data = flightData.data.filter(({ origin }) => origin === airport)
    if (flightData.data.length === 0) {
      console.error(
        `[Amadeus API] Error fetching flight inspiration for airport: ${airport}`,
      )
      return {
        success: false,
        message: `No flight inspiration found for airport: ${airport}`,
      }
    }
  }

  const flightDataWithSelectedFields = flightData.data.map(
    ({ destination, price: { total } }) => ({
      iataCode: destination,
      total,
    }),
  )

  const flightDataIncludingDepartureLocation = [
    { iataCode: airport ?? city, total: 0 },
    ...flightDataWithSelectedFields,
  ]

  console.log('[Amadeus API] Flight inspiration data fetched successfully')

  return {
    success: true,
    data: flightDataIncludingDepartureLocation,
  }
}
