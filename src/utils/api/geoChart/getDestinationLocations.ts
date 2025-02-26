import type {
  AmadeusAPIResponse,
  FlightDestinationPrice,
  FlightDestinationWithPrice,
  FlightLocation,
  ServerActionResponse,
} from '@/types/amadeus'
import { AMADEUS_ENDPOINTS, fetchFromAmadeus, getServerActionMessages } from '../helpers'

interface GetDestinationLocationsProps {
  flightData: FlightDestinationPrice[]
  token: string
}

export const getDestinationLocations = async ({
  flightData,
  token,
}: GetDestinationLocationsProps): Promise<
  ServerActionResponse<FlightDestinationWithPrice[]>
> => {
  console.log('[Amadeus API] Fetching destination locations')

  const flightDetails = await Promise.allSettled(
    flightData.map(async ({ iataCode, total }) => {
      const response = await fetchFromAmadeus(
        `/reference-data/locations?subType=AIRPORT&keyword=${iataCode}`,
        token,
        {},
        AMADEUS_ENDPOINTS.DESTINATION_LOCATIONS,
      )

      if (!response.success) {
        console.error(
          '[Amadeus API] Error fetching destination locations:',
          response.message,
        )
        return response
      }

      const locationDetails: AmadeusAPIResponse<FlightLocation> = response.data

      if (
        !locationDetails.data?.[0]?.geoCode ||
        (iataCode !== locationDetails.data?.[0]?.iataCode &&
          iataCode !== locationDetails.data?.[0]?.address.cityCode)
      ) {
        console.error(
          '[Amadeus API] Error fetching destination locations:',
          getServerActionMessages(AMADEUS_ENDPOINTS.DESTINATION_LOCATIONS).dataInvalid,
        )
        return {
          success: false,
          message: getServerActionMessages(AMADEUS_ENDPOINTS.DESTINATION_LOCATIONS)
            .dataInvalid,
        }
      }

      const { name: airportName, geoCode, address } = locationDetails.data[0]
      const { cityName } = address

      return {
        success: true,
        data: { iataCode, total, airportName, geoCode, cityName },
      }
    }),
  )

  const successfulFlights = flightDetails
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<{
        success: true
        data: {
          iataCode: string
          total: number
          airportName: string
          geoCode: { latitude: number; longitude: number }
          cityName: string
        }
      }> => {
        return result.status === 'fulfilled' && result.value.success === true
      },
    )
    .map((result) => result.value.data)

  console.log('[Amadeus API] Destination locations fetched successfully')

  return {
    success: true,
    data: successfulFlights,
  }
}
