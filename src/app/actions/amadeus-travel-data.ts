'use server'

import { AMADEUS_CONFIG, MESSAGES } from '@/constants/serverActions'
import type {
  AmadeusAPIResponse,
  AmadeusAuthResponse,
  AmadeusDestinationResponse,
} from '@/types/amadeus'

export async function fetchTravelData(cityCode: string): Promise<AmadeusAPIResponse> {
  try {
    const { clientId, clientSecret, apiUrl } = AMADEUS_CONFIG

    if (!clientId || !clientSecret || !apiUrl) {
      console.error('[API] Missing Amadeus configuration')
      return {
        success: false,
        message: MESSAGES.CONFIG_ERROR,
      }
    }

    let token = ''

    try {
      const url = `${apiUrl}/security/oauth2/token`
      const urlencoded = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlencoded.toString(),
      })

      const responseData: AmadeusAuthResponse = await response.json()

      if (!responseData.state) {
        console.error('[API] Fetching Amadeus token error:', responseData)
        return {
          success: false,
          message: responseData.error_description || MESSAGES.FETCH_TOKEN_FAILED,
        }
      }

      token = responseData.access_token || ''
    } catch (error) {
      console.error('[API] Error fetching token:', error)
      return {
        success: false,
        message: MESSAGES.FETCH_TOKEN_FAILED,
      }
    }

    try {
      const travelResponse: Response = await fetch(
        `${apiUrl}/reference-data/recommended-locations?cityCodes=${cityCode}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      const travelResponseData: AmadeusDestinationResponse = await travelResponse.json()

      if (!travelResponseData.data) {
        console.error('[API] Fetching Amadeus token error:', travelResponseData)
        return {
          success: false,
          message: travelResponseData.error_description || MESSAGES.FETCH_TOKEN_FAILED,
        }
      }

      console.log('[API] Successfully fetched travel data with city origin:', cityCode)
      return { success: true, data: travelResponseData }
    } catch (error) {
      console.error('[API] Error fetching travel data:', error)

      return {
        success: false,
        message: MESSAGES.FETCH_TRAVEL_DATA_FAILED,
      }
    }
  } catch (error) {
    console.error('[API] Internal server error:', error)

    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
    }
  }
}
