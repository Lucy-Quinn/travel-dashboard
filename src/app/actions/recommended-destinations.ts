'use server'

import { AMADEUS_CONFIG, MESSAGES } from '@/constants/serverActions'
import type {
  AmadeusAPIResponse,
  AmadeusDestinationRecommendation,
  AmadeusDestinationResponse,
} from '@/types/amadeus'
import { getAmadeusToken } from '@/utils/api/amadeus'

export async function fetchRecommendedDestinations(
  cityCode: string,
): Promise<AmadeusAPIResponse<AmadeusDestinationRecommendation>> {
  try {
    const { apiUrl } = AMADEUS_CONFIG

    const { success, token, message } = await getAmadeusToken()

    if (!success) {
      console.error('[API] Error fetching Amadeus token:', message)
      return { success, message }
    }

    try {
      const travelResponse: Response = await fetch(
        `${apiUrl}/reference-data/recommended-locations?cityCodes=${cityCode}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!travelResponse.ok) {
        const errorResponse = await travelResponse.json()
        console.error(
          `[API] Error fetching Amadeus recommended destinations: ${errorResponse.title}`,
        )

        return {
          success: false,
          message:
            errorResponse.error_description ||
            MESSAGES.FETCH_RECOMMENDED_DESTINATIONS_REQUEST_FAILED,
        }
      }

      const travelResponseData: AmadeusDestinationResponse<AmadeusDestinationRecommendation> =
        await travelResponse.json()
      console.log('🚀 ~ travelResponseData FIRST:', travelResponseData)

      if (!travelResponseData.data) {
        console.error(
          '[API] Fetching Amadeus recommended destinations data error:',
          travelResponseData,
        )
        return {
          success: false,
          message:
            travelResponseData.error_description ||
            MESSAGES.FETCH_RECOMMENDED_DESTINATIONS_DATA_INVALID,
        }
      }

      console.log(
        '[API] Successfully fetched Amadeus recommended destinations with city origin:',
        cityCode,
      )
      return { success: true, data: travelResponseData.data }
    } catch (error) {
      console.error('[API] Error fetching Amadeus recommended destinations:', error)

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : MESSAGES.FETCH_RECOMMENDED_DESTINATIONS_FAILED,
      }
    }
  } catch (error) {
    console.error('[API] Internal server error:', error)

    return {
      success: false,
      message: error instanceof Error ? error.message : MESSAGES.INTERNAL_ERROR,
    }
  }
}
