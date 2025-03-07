import { AMADEUS_ENDPOINTS } from '@/constants/serverActions'
import type { DestinationRecommendation } from '@/types/amadeus'
import { getAmadeusToken } from '@/utils/api/geoChart/getAmadeusToken'
import { fetchFromAmadeus, getServerActionMessages } from '@/utils/api/helpers'

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
    const errorMessage =
      message ||
      getServerActionMessages(AMADEUS_ENDPOINTS.RECOMMENDED_DESTINATIONS).requestFailed

    console.error(
      `[API] Error fetching Amadeus recommended destinations: ${message || 'Unknown error'}`,
    )
    return {
      success: false,
      message: errorMessage,
    }
  }

  const travelResponseData: DestinationRecommendation[] = data ?? []

  console.log('[Amadeus API] Recommended destinations fetched successfully')

  return { success: true, data: travelResponseData }
}
