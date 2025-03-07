import { AMADEUS_ENDPOINTS } from '@/constants/serverActions'
import type {
  FlightDestinationPrice,
  FlightInspiration,
  ServerActionResponse,
} from '@/types/amadeus'
import { fetchFromAmadeus, getServerActionMessages } from '../helpers'

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

  const { success, data, message } = await fetchFromAmadeus<FlightInspiration>({
    endpoint: `/shopping/flight-destinations?origin=${city}`,
    token,
    options: {},
    endpointType: AMADEUS_ENDPOINTS.FLIGHT_INSPIRATION,
  })

  if (!success || !data || !data[0]) {
    const errorMessage =
      message ||
      getServerActionMessages(AMADEUS_ENDPOINTS.FLIGHT_INSPIRATION).requestFailed
    console.error(
      '[Amadeus API] Error fetching flight inspiration:',
      errorMessage || 'Unknown error',
    )
    return {
      success,
      message: errorMessage,
    }
  }

  let flightData: FlightInspiration[] = data

  if (airport) {
    flightData = flightData.filter(({ origin }) => origin === airport)
    if (flightData.length === 0) {
      console.error(
        `[Amadeus API] Error fetching flight inspiration for airport: ${airport}`,
      )
      return {
        success: false,
        message: `No flight inspiration found for airport: ${airport}`,
      }
    }
  }

  const flightDataWithSelectedFields = flightData.map(
    ({ destination, price: { total } }) => ({
      iataCode: destination,
      total,
    }),
  )

  const flightDataIncludingDepartureLocation: FlightDestinationPrice[] = [
    { iataCode: airport ?? city, total: '0' },
    ...flightDataWithSelectedFields,
  ]

  console.log('[Amadeus API] Flight inspiration data fetched successfully')

  return {
    success: true,
    data: flightDataIncludingDepartureLocation,
  }
}
