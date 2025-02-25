import { AMADEUS_CONFIG, MESSAGES } from '@/constants/serverActions'

export const AMADEUS_ENDPOINTS = {
  TOKEN: 'token',
  FLIGHT_INSPIRATION: 'flightInspiration',
  ORIGIN_LOCATION: 'originLocation',
  DESTINATION_LOCATIONS: 'destinationLocations',
} as const

export type AmadeusEndpoint = (typeof AMADEUS_ENDPOINTS)[keyof typeof AMADEUS_ENDPOINTS]

export const getServerActionMessages = (endpoint: AmadeusEndpoint) => {
  const messages = {
    [AMADEUS_ENDPOINTS.TOKEN]: {
      requestFailed: MESSAGES.FETCH_TOKEN_REQUEST_FAILED,
      dataInvalid: MESSAGES.FETCH_TOKEN_DATA_INVALID,
    },
    [AMADEUS_ENDPOINTS.FLIGHT_INSPIRATION]: {
      requestFailed: MESSAGES.FETCH_FLIGHT_INSPIRATION_REQUEST_FAILED,
      dataInvalid: MESSAGES.FETCH_FLIGHT_INSPIRATION_DATA_INVALID,
    },
    [AMADEUS_ENDPOINTS.ORIGIN_LOCATION]: {
      requestFailed: MESSAGES.FETCH_ORIGIN_LOCATION_REQUEST_FAILED,
      dataInvalid: MESSAGES.FETCH_ORIGIN_LOCATION_DATA_INVALID,
    },
    [AMADEUS_ENDPOINTS.DESTINATION_LOCATIONS]: {
      requestFailed: MESSAGES.FETCH_DESTINATION_LOCATIONS_REQUEST_FAILED,
      dataInvalid: MESSAGES.FETCH_DESTINATION_LOCATIONS_DATA_INVALID,
    },
  }
  return messages[endpoint]
}

export const fetchFromAmadeus = async (
  endpoint: string,
  token: string,
  options: RequestInit = {},
  endpointType: AmadeusEndpoint,
) => {
  try {
    const headers =
      token.length === 0
        ? options.headers
        : {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
          }

    const response = await fetch(`${AMADEUS_CONFIG.apiUrl}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()
    const messages = getServerActionMessages(endpointType)

    if (!response.ok) {
      console.error(
        `[Amadeus API] Error fetching ${endpoint}: ${data?.errors?.[0]?.title || 'Unknown error'}`,
      )
      return {
        success: false,
        message: data?.errors?.[0]?.detail || messages.requestFailed,
      }
    }

    if (!data) {
      console.error(`[Amadeus API] No data found for ${endpoint}`)
      return {
        success: false,
        message: messages.dataInvalid,
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error(`[Amadeus API] Fetch error: ${error}`)
    return { success: false, message: 'Network error' }
  }
}
