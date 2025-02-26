import { AMADEUS_CONFIG, MESSAGES } from '@/constants/serverActions'
import type { AmadeusAuthResponse, ServerActionResponse } from '@/types/amadeus'
import { AMADEUS_ENDPOINTS, fetchFromAmadeus, getServerActionMessages } from '../helpers'

export const getAmadeusToken = async (): Promise<
  ServerActionResponse<AmadeusAuthResponse>
> => {
  const { clientId, clientSecret, apiUrl } = AMADEUS_CONFIG

  if (!clientId || !clientSecret || !apiUrl) {
    console.error('[Amadeus API] Missing Amadeus configuration')
    return {
      success: false,
      message: MESSAGES.CONFIG_ERROR,
    }
  }

  console.log('[Amadeus API] Requesting authentication token')
  const url = 'security/oauth2/token'
  const urlencoded = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  })

  const response = await fetchFromAmadeus(
    url,
    '',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlencoded.toString(),
    },
    AMADEUS_ENDPOINTS.TOKEN,
  )

  if (!response.success) {
    console.error('[Amadeus API] Error fetching token:', response.message)
    return response
  }

  const token = response.data.access_token || ''

  if (!token) {
    console.error(
      '[Amadeus API] Error fetching token:',
      getServerActionMessages(AMADEUS_ENDPOINTS.TOKEN).dataInvalid,
    )
    return {
      success: false,
      message: getServerActionMessages(AMADEUS_ENDPOINTS.TOKEN).dataInvalid,
    }
  }

  console.log('[Amadeus API] Token fetched successfully')
  return {
    success: true,
    data: token,
  }
}
