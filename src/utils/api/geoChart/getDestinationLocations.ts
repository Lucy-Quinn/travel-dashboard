import { AMADEUS_ENDPOINTS } from '@/constants/serverActions'
import type {
  FlightDestinationPrice,
  FlightDestinationWithPrice,
  FlightLocation,
  ServerActionResponse,
} from '@/types/amadeus'
import { fetchFromAmadeus, getServerActionMessages } from '@/utils/api/helpers'

export interface GetDestinationLocationsProps {
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
      const { success, data, message } = await fetchFromAmadeus<FlightLocation>({
        endpoint: `/reference-data/locations?subType=AIRPORT&keyword=${iataCode}`,
        token,
        options: {},
        endpointType: AMADEUS_ENDPOINTS.DESTINATION_LOCATIONS,
      })

      if (!success) {
        console.error(
          '[Amadeus API] Error fetching destination locations:',
          message || 'Failed to fetch destination locations',
        )
        return {
          success,
          message,
        }
      }

      const locationDetails: FlightLocation[] = data ?? []

      if (
        !locationDetails?.[0]?.geoCode ||
        (iataCode !== locationDetails?.[0]?.iataCode &&
          iataCode !== locationDetails?.[0]?.address.cityCode)
      ) {
        const errorMessage =
          message ||
          getServerActionMessages(AMADEUS_ENDPOINTS.DESTINATION_LOCATIONS).dataInvalid

        console.error('[Amadeus API] Error fetching destination locations:', errorMessage)
        return {
          success: false,
          message: errorMessage,
        }
      }

      const { name: airportName, geoCode, address } = locationDetails[0]
      const { cityName } = address

      return {
        success: true,
        data: { iataCode, total, airportName, geoCode, cityName },
      }
    }),
  )

  const fulfilledResults = flightDetails
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)

  const successfulResults = fulfilledResults.filter(
    (result): result is { success: true; data: FlightDestinationWithPrice } =>
      result.success === true,
  )

  if (successfulResults.length === 0 && fulfilledResults.length > 0) {
    const firstError = fulfilledResults[0]
    return {
      success: false,
      message: firstError.message || 'Failed to fetch destination locations',
    }
  }

  console.log('[Amadeus API] Destination locations fetched successfully')

  return {
    success: true,
    data: successfulResults.map((result) => result.data),
  }
}
