import { AMADEUS_ENDPOINTS, MESSAGES } from '@/constants/serverActions'
import type { DestinationRecommendation } from '@/types/amadeus'
import { getAmadeusToken } from '@/utils/api/geoChart/getAmadeusToken'
import { fetchFromAmadeus } from '@/utils/api/helpers'

export const getRecommendedDestinations = async (cityCode: string) => {
  const {
    success: tokenSuccess,
    data: token,
    message: tokenMessage,
  } = await getAmadeusToken()
  if (!tokenSuccess || !token) {
    console.error(`[Amadeus API] Error fetching token: ${tokenMessage}`)
    return { success: tokenSuccess, message: tokenMessage }
  }

  const { success, data, message } = await fetchFromAmadeus<DestinationRecommendation>({
    endpoint: `/reference-data/recommended-locations?cityCodes=${cityCode}`,
    token,
    options: {},
    endpointType: AMADEUS_ENDPOINTS.RECOMMENDED_DESTINATIONS,
  })
  if (!success) {
    console.error(
      `[API] Error fetching Amadeus recommended destinations: ${message || 'Unknown error'}`,
    )
    return {
      success: false,
      message: message || MESSAGES.FETCH_RECOMMENDED_DESTINATIONS_REQUEST_FAILED,
    }
  }

  const travelResponseData: DestinationRecommendation[] = data ?? []

  console.log(
    '[API] Successfully fetched Amadeus recommended destinations with city origin:',
    cityCode,
  )
  return { success: true, data: travelResponseData }
}
