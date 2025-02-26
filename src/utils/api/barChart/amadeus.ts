import { MESSAGES } from '@/constants/serverActions'
import { AmadeusAPIResponse, DestinationRecommendation } from '@/types/amadeus'
import { getAmadeusToken } from '@/utils/api/geoChart/getAmadeusToken'
import { AMADEUS_ENDPOINTS, fetchFromAmadeus } from '@/utils/api/helpers'

export const getRecommendedDestinations = async (cityCode: string) => {
  const {
    success: tokenSuccess,
    data: token,
    message: tokenMessage,
  } = await getAmadeusToken()
  if (!tokenSuccess || !token) {
    console.error('[Amadeus API] Error fetching token:', tokenMessage)
    return { success: tokenSuccess, message: tokenMessage }
  }

  const { success, data, message } = await fetchFromAmadeus(
    `/reference-data/recommended-locations?cityCodes=${cityCode}`,
    token,
    {},
    AMADEUS_ENDPOINTS.RECOMMENDED_DESTINATIONS,
  )
  if (!success) {
    console.error(`[API] Error fetching Amadeus recommended destinations: ${message}`)
    return {
      success: false,
      message: message || MESSAGES.FETCH_RECOMMENDED_DESTINATIONS_REQUEST_FAILED,
    }
  }

  const travelResponseData: AmadeusAPIResponse<DestinationRecommendation> = data

  console.log(
    '[API] Successfully fetched Amadeus recommended destinations with city origin:',
    cityCode,
  )
  return { success: true, data: travelResponseData.data }
}
