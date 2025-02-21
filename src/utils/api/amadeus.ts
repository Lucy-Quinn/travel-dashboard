import { AMADEUS_CONFIG } from '@/constants/serverActions'

import { MESSAGES } from '@/constants/serverActions'
import type {
  AmadeusAPIResponse,
  AmadeusAuthResponse,
  FlightInspiration,
  FlightLocation,
} from '@/types/amadeus'

// 1. Get token
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

// 2. Get flight inspiration data
export const getFlightInspiration = async (originCity: string) => {
  const { success, token, message } = await getAmadeusToken()
  if (!success) return { success, message }

  const flightInspirationResponse = await fetch(
    `${AMADEUS_CONFIG.apiUrl}/shopping/flight-destinations?origin=${originCity}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )

  if (!flightInspirationResponse.ok) {
    const errorResponse = await flightInspirationResponse.json()
    console.error(
      `[API] Error fetching Amadeus flight inspiration: ${errorResponse.title}`,
    )
    return {
      success: false,
      message:
        errorResponse.error_description ||
        MESSAGES.FETCH_FLIGHT_INSPIRATION_REQUEST_FAILED,
    }
  }

  const flightData: AmadeusAPIResponse<FlightInspiration> =
    await flightInspirationResponse.json()

  if (!flightData.data) {
    console.error('[API] Fetching Amadeus flight inspiration data error:', flightData)
    return {
      success: false,
      message: MESSAGES.FETCH_FLIGHT_INSPIRATION_DATA_INVALID,
    }
  }

  const flightDataWithSelectedFields = flightData.data.map(
    ({ destination, price: { total } }) => ({
      iataCode: destination,
      total,
    }),
  )

  const flightDataWithOriginAndSelectedFields = [
    { iataCode: originCity, total: 0 },
    ...flightDataWithSelectedFields,
  ]

  console.log('Amadeus API flight inspiration data fetched successfully')
  return {
    success: true,
    data: flightDataWithOriginAndSelectedFields,
  }
}

// 3. Get location details for each flight
export const getFlightInspirationWithLocations = async (originCity: string) => {
  const { success, token, message } = await getAmadeusToken()
  if (!success) return { success, message }

  const {
    success: flightInspirationSuccess,
    data: flightData,
    message: flightInspirationMessage,
  } = await getFlightInspiration(originCity)

  if (!flightInspirationSuccess)
    return { success: flightInspirationSuccess, message: flightInspirationMessage }

  if (!flightData)
    return {
      success: false,
      message: MESSAGES.FETCH_FLIGHT_INSPIRATION_DATA_INVALID,
    }

  const flightDetails = await Promise.allSettled(
    flightData.map(async ({ iataCode, total }) => {
      const response = await fetch(
        `${AMADEUS_CONFIG.apiUrl}/reference-data/locations?subType=AIRPORT&keyword=${iataCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!response.ok) {
        const errorResponse = await response.json()
        console.error(
          `[API] Error fetching Amadeus flight location details for ${iataCode}: ${errorResponse.title}`,
        )
        return {
          iataCode,
          total,
          error: MESSAGES.FETCH_FLIGHT_LOCATION_DETAILS_REQUEST_FAILED,
        }
      }

      const locationDetails: AmadeusAPIResponse<FlightLocation> = await response.json()

      if (
        !locationDetails.data?.[0]?.geoCode ||
        iataCode !== locationDetails.data?.[0]?.iataCode
      ) {
        console.error(`[API] No location data found for ${iataCode}:`, locationDetails)
        return {
          iataCode,
          total,
          error: MESSAGES.FETCH_FLIGHT_LOCATION_DETAILS_DATA_INVALID,
        }
      }

      const { name: airportName, geoCode, address } = locationDetails.data[0]
      const { cityName } = address

      return { iataCode, total, airportName, geoCode, cityName }
    }),
  )

  const successfulFlights = flightDetails
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<{
        iataCode: string
        total: number
        airportName: string
        geoCode: { latitude: number; longitude: number }
        cityName: string
      }> => result.status === 'fulfilled' && !('error' in result.value),
    )
    .map((result) => result.value)

  return {
    success: true,
    data: successfulFlights,
  }
}
