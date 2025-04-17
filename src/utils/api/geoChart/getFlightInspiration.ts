import { AMADEUS_ENDPOINTS } from '@/constants/serverActions'
import type {
  FlightIataCodeAndPrice,
  FlightInspiration,
  ServerActionResponse,
} from '@/types/amadeus'
import { fetchFromAmadeus, getServerActionMessages } from '@/utils/api/helpers'

export interface GetFlightInspirationProps {
  city: string
  airport?: string
  token: string
}

export const getFlightInspiration = async ({
  city,
  airport,
  token,
}: GetFlightInspirationProps): Promise<
  ServerActionResponse<FlightIataCodeAndPrice[]>
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
      (!success
        ? getServerActionMessages(AMADEUS_ENDPOINTS.FLIGHT_INSPIRATION).requestFailed
        : getServerActionMessages(AMADEUS_ENDPOINTS.FLIGHT_INSPIRATION).dataInvalid)
    console.error('[Amadeus API] Error fetching flight inspiration:', errorMessage)
    return {
      success,
      message: errorMessage,
    }
  }

  let flightData: FlightInspiration[] = data

  // Filter flights to match specific airport (e.g., LHR vs LGW for London)
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

  const flightDataIncludingDepartureLocation: FlightIataCodeAndPrice[] = [
    { iataCode: airport ?? city, total: '0' },
    ...flightDataWithSelectedFields,
  ]

  console.log('[Amadeus API] Flight inspiration data fetched successfully')

  return {
    success: true,
    data: flightDataIncludingDepartureLocation,
  }
}
