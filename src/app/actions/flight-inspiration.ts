'use server'

import { AMADEUS_CONFIG, MESSAGES } from '@/constants/serverActions'
import type {
  AmadeusAPIResponse,
  AmadeusDestinationResponse,
  AmadeusFlightInspiration,
  AmadeusFlightInspirationResponse,
} from '@/types/amadeus'
import { getAmadeusToken } from '@/utils/api/amadeus'

export async function fetchFlightInspiration(): Promise<
  AmadeusAPIResponse<AmadeusFlightInspirationResponse>
> {
  try {
    // 1. Get token
    const { success, token, message } = await getAmadeusToken()
    if (!success) return { success, message }

    // 2. Get flight inspiration data
    const flightInspirationResponse = await fetch(
      `${AMADEUS_CONFIG.apiUrl}/shopping/flight-destinations?origin=MAD`,
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

    const flightData: AmadeusDestinationResponse<AmadeusFlightInspiration> =
      await flightInspirationResponse.json()
    console.log('🚀 ~ fetchFlightInspiration ~ flightData - FIRST:', flightData)

    if (!flightData.data) {
      console.error('[API] Fetching Amadeus flight inspiration data error:', flightData)
      return {
        success: false,
        message: MESSAGES.FETCH_FLIGHT_INSPIRATION_DATA_INVALID,
      }
    }

    console.log('Amadeus API flight inspiration data fetched successfully')

    // 3. Get location details for each flight
    const flightDetails = await Promise.allSettled(
      flightData.data.map(async ({ destination, price: { total } }) => {
        const response = await fetch(
          `${AMADEUS_CONFIG.apiUrl}/reference-data/locations?subType=AIRPORT&keyword=${destination}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!response.ok) {
          const errorResponse = await response.json()
          console.error(
            `[API] Error fetching Amadeus flight location details for ${destination}: ${errorResponse.title}`,
          )
          return {
            destination,
            total,
            error: MESSAGES.FETCH_FLIGHT_LOCATION_DETAILS_REQUEST_FAILED,
          }
        }

        const locationDetails = await response.json()
        if (!locationDetails.data?.[0]?.geoCode) {
          console.error(
            `[API] No location data found for ${destination}:`,
            locationDetails,
          )
          return {
            destination,
            total,
            error: MESSAGES.FETCH_FLIGHT_LOCATION_DETAILS_DATA_INVALID,
          }
        }

        return { destination, total, geoCode: locationDetails.data[0].geoCode }
      }),
    )

    // console.log('🚀 ~ fetchFlightInspiration ~ FLIGHT DETAILS:', flightDetails)

    const successfulFlights = flightDetails
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          destination: string
          total: number
          geoCode: { latitude: number; longitude: number }
        }> => result.status === 'fulfilled' && !('error' in result.value),
      )
      .map((result) => result.value)

    // const failedFlights = flightDetails
    //   .filter(
    //     (result) =>
    //       result.status === 'rejected' ||
    //       (result.status === 'fulfilled' && result.value.error),
    //   )
    //   .map((result) => (result.status === 'rejected' ? result.reason : result.value))

    console.log('✅ Successful flights:', successfulFlights)
    // console.log('❌ Failed flights:', failedFlights)

    return { success: true, data: successfulFlights }
  } catch (error) {
    console.error('[API] Error:', error)
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
    }
  }
}
