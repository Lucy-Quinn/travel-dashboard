import { AMADEUS_CONFIG, AMADEUS_ENDPOINTS, MESSAGES } from '@/constants/serverActions'
import type {
  AmadeusAPIResponse,
  AmadeusEndpoint,
  ServerActionResponse,
} from '@/types/amadeus'

export const getServerActionMessages = (
  endpoint: AmadeusEndpoint,
): { requestFailed: string; dataInvalid: string } => {
  const messages = {
    [AMADEUS_ENDPOINTS.TOKEN]: {
      requestFailed: MESSAGES.FETCH_TOKEN_REQUEST_FAILED,
      dataInvalid: MESSAGES.FETCH_TOKEN_DATA_INVALID,
    },
    [AMADEUS_ENDPOINTS.RECOMMENDED_DESTINATIONS]: {
      requestFailed: MESSAGES.FETCH_RECOMMENDED_DESTINATIONS_REQUEST_FAILED,
      dataInvalid: MESSAGES.FETCH_RECOMMENDED_DESTINATIONS_DATA_INVALID,
    },
    [AMADEUS_ENDPOINTS.FLIGHT_INSPIRATION]: {
      requestFailed: MESSAGES.FETCH_FLIGHT_INSPIRATION_REQUEST_FAILED,
      dataInvalid: MESSAGES.FETCH_FLIGHT_INSPIRATION_DATA_INVALID,
    },
    [AMADEUS_ENDPOINTS.DEPARTURE_LOCATION]: {
      requestFailed: MESSAGES.FETCH_DEPARTURE_LOCATION_REQUEST_FAILED,
      dataInvalid: MESSAGES.FETCH_DEPARTURE_LOCATION_DATA_INVALID,
    },
    [AMADEUS_ENDPOINTS.DESTINATION_LOCATIONS]: {
      requestFailed: MESSAGES.FETCH_DESTINATION_LOCATIONS_REQUEST_FAILED,
      dataInvalid: MESSAGES.FETCH_DESTINATION_LOCATIONS_DATA_INVALID,
    },
  }
  return messages[endpoint]
}

function normalizeAmadeusResponse<T>(response: AmadeusAPIResponse<T>): T[] {
  if ('data' in response) {
    if (Array.isArray(response.data)) {
      return response.data
    }
    return [response.data]
  }
  return [response]
}

export interface FetchFromAmadeusProps {
  endpoint: string
  token: string
  options: RequestInit
  endpointType: AmadeusEndpoint
}

export const fetchFromAmadeus = async <T>({
  endpoint,
  token,
  options,
  endpointType,
}: FetchFromAmadeusProps): Promise<ServerActionResponse<T[]>> => {
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

    const data: AmadeusAPIResponse<T> = await response.json()
    const messages = getServerActionMessages(endpointType)
    const normalizedData = normalizeAmadeusResponse(data)

    if (!response.ok) {
      console.error(
        `[Amadeus API] Error fetching ${endpoint}: ${data?.errors?.[0]?.title || 'Unknown error'}`,
      )
      return {
        success: false,
        message: data?.errors?.[0]?.detail || messages.requestFailed,
      }
    }

    if (!normalizedData || normalizedData.length === 0) {
      console.error(`[Amadeus API] No data found for ${endpoint}`)
      return {
        success: false,
        message: messages.dataInvalid,
      }
    }

    return { success: true, data: normalizedData }
  } catch (error) {
    console.error(`[Amadeus API] Fetch error: ${error}`)
    return { success: false, message: 'Network error' }
  }
}
