import type {
  FlightDestinationPrice,
  FlightDestinationWithPrice,
  ServerActionResponse,
} from '@/types/amadeus'
import { AmadeusAPIResponse, FlightLocation } from '@/types/amadeus'
import { AMADEUS_ENDPOINTS, fetchFromAmadeus, getServerActionMessages } from './helpers'

interface GetOriginCityLocationProps {
  originCity: string
  flightData: FlightDestinationPrice[]
  token: string
}

export const getOriginCityLocation = async ({
  originCity,
  flightData,
  token,
}: GetOriginCityLocationProps): Promise<
  ServerActionResponse<FlightDestinationWithPrice>
> => {
  console.log(`[Amadeus API] Fetching origin city location details for ${originCity}`)
  const originCityIataCode = flightData.find(
    (flight) => flight.iataCode === originCity,
  )?.iataCode

  if (!originCityIataCode) {
    console.error('[Amadeus API] No origin city IATA code found')
    return {
      success: false,
      message: getServerActionMessages(AMADEUS_ENDPOINTS.ORIGIN_LOCATION).dataInvalid,
    }
  }

  const response = await fetchFromAmadeus(
    `/reference-data/locations?subType=AIRPORT&keyword=${originCityIataCode}`,
    token,
    {},
    AMADEUS_ENDPOINTS.ORIGIN_LOCATION,
  )

  if (!response.success) {
    console.error('[Amadeus API] Error fetching origin city location:', response.message)
    return response
  }

  const originCityLocationDetails: AmadeusAPIResponse<FlightLocation> = response.data

  if (!originCityLocationDetails.data?.[0]) {
    console.error(
      '[Amadeus API] No location data found for origin city:',
      getServerActionMessages(AMADEUS_ENDPOINTS.ORIGIN_LOCATION).dataInvalid,
    )
    return {
      success: false,
      message: getServerActionMessages(AMADEUS_ENDPOINTS.ORIGIN_LOCATION).dataInvalid,
    }
  }

  const { name: airportName, geoCode, address } = originCityLocationDetails.data[0]
  const { cityName } = address
  const originCityLocation = {
    iataCode: originCityIataCode,
    total: 0,
    airportName,
    geoCode,
    cityName,
  }

  console.log('[Amadeus API] Origin city location details fetched successfully')

  return {
    success: true,
    data: originCityLocation,
  }
}
