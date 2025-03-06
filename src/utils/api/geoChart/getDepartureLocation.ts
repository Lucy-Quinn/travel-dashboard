import { AMADEUS_ENDPOINTS } from '@/constants/serverActions'
import type {
  FlightDestinationPrice,
  FlightDestinationWithPrice,
  FlightLocation,
  ServerActionResponse,
} from '@/types/amadeus'
import { fetchFromAmadeus, getServerActionMessages } from '../helpers'

export interface GetDepartureLocationProps {
  departureLocation: string
  flightData: FlightDestinationPrice[]
  token: string
}

export const getDepartureLocation = async ({
  departureLocation,
  flightData,
  token,
}: GetDepartureLocationProps): Promise<
  ServerActionResponse<FlightDestinationWithPrice>
> => {
  console.log(
    `[Amadeus API] Fetching departure location details for ${departureLocation}`,
  )

  const departureLocationIataCode = flightData.find(
    (flight) => flight.iataCode === departureLocation,
  )?.iataCode

  if (!departureLocationIataCode) {
    console.error('[Amadeus API] No departure location IATA code found')
    return {
      success: false,
      message: getServerActionMessages(AMADEUS_ENDPOINTS.DEPARTURE_LOCATION).dataInvalid,
    }
  }

  const { success, data, message } = await fetchFromAmadeus<FlightLocation>({
    endpoint: `/reference-data/locations?subType=AIRPORT&keyword=${departureLocationIataCode}`,
    token,
    options: {},
    endpointType: AMADEUS_ENDPOINTS.DEPARTURE_LOCATION,
  })

  if (!success) {
    console.error(
      `[Amadeus API] Error fetching departure location: ${message || 'Unknown error'}`,
    )
    return {
      success,
      message,
    }
  }

  const departureLocationDetails: FlightLocation[] = data ?? []

  if (!departureLocationDetails?.[0]) {
    const errorMessage = getServerActionMessages(
      AMADEUS_ENDPOINTS.DEPARTURE_LOCATION,
    ).dataInvalid
    console.error(
      `[Amadeus API] No location data found for departure location: ${
        errorMessage || 'Unknown error'
      }`,
    )
    return {
      success: false,
      message: errorMessage,
    }
  }

  const { name: airportName, geoCode, address } = departureLocationDetails[0]
  const { cityName } = address
  const departureLocationData = {
    iataCode: departureLocationIataCode,
    total: '0',
    airportName,
    geoCode,
    cityName,
  }

  console.log('[Amadeus API] Departure location details fetched successfully')

  return {
    success: true,
    data: departureLocationData,
  }
}
