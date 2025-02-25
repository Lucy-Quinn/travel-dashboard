import type {
  AmadeusAPIResponse,
  FlightDestinationPrice,
  FlightDestinationWithPrice,
  FlightLocation,
  ServerActionResponse,
} from '@/types/amadeus'
import { AMADEUS_ENDPOINTS, fetchFromAmadeus, getServerActionMessages } from './helpers'

interface GetDepartureLocationProps {
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

  const response = await fetchFromAmadeus(
    `/reference-data/locations?subType=AIRPORT&keyword=${departureLocationIataCode}`,
    token,
    {},
    AMADEUS_ENDPOINTS.DEPARTURE_LOCATION,
  )

  if (!response.success) {
    console.error('[Amadeus API] Error fetching departure location:', response.message)
    return response
  }

  const departureLocationDetails: AmadeusAPIResponse<FlightLocation> = response.data

  if (!departureLocationDetails.data?.[0]) {
    console.error(
      '[Amadeus API] No location data found for departure location:',
      getServerActionMessages(AMADEUS_ENDPOINTS.DEPARTURE_LOCATION).dataInvalid,
    )
    return {
      success: false,
      message: getServerActionMessages(AMADEUS_ENDPOINTS.DEPARTURE_LOCATION).dataInvalid,
    }
  }

  const { name: airportName, geoCode, address } = departureLocationDetails.data[0]
  const { cityName } = address
  const departureLocationData = {
    iataCode: departureLocationIataCode,
    total: 0,
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
