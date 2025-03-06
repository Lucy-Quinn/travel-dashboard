import { AMADEUS_CONFIG, AMADEUS_ENDPOINTS, MESSAGES } from '@/constants/serverActions'
import type {
  AccessToken,
  AmadeusAuthResponse,
  ServerActionResponse,
} from '@/types/amadeus'
import { fetchFromAmadeus, getServerActionMessages } from '@/utils/api/helpers'

export const getAmadeusToken = async (): Promise<ServerActionResponse<AccessToken>> => {
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

  const { success, data, message } = await fetchFromAmadeus<AmadeusAuthResponse>({
    endpoint: url,
    token: '',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlencoded.toString(),
    },
    endpointType: AMADEUS_ENDPOINTS.TOKEN,
  })

  if (!success) {
    console.error(`[Amadeus API] Error fetching token: ${message || 'Unknown error'}`)
    return {
      success,
      message,
    }
  }

  const token: AccessToken = data?.[0]?.access_token || ''

  if (!token) {
    const dataInvalidMessage = getServerActionMessages(
      AMADEUS_ENDPOINTS.TOKEN,
    ).dataInvalid
    console.error(
      `[Amadeus API] Error fetching token: ${dataInvalidMessage || 'Unknown error'}`,
    )
    return {
      success: false,
      message: dataInvalidMessage,
    }
  }

  console.log('[Amadeus API] Token fetched successfully')
  return {
    success: true,
    data: token,
  }
}
