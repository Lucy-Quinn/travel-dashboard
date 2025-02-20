import { AMADEUS_CONFIG } from '@/constants/serverActions'

import { MESSAGES } from '@/constants/serverActions'
import { AmadeusAuthResponse } from '@/types/amadeus'

export const getAmadeusToken = async () => {
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

    return {
      success: true,
      token,
      message: MESSAGES.FETCH_TOKEN_SUCCESS,
    }
  } catch (error) {
    console.error('[API] Error fetching token:', error)
    return {
      success: false,
      message: MESSAGES.FETCH_TOKEN_FAILED,
    }
  }
}
