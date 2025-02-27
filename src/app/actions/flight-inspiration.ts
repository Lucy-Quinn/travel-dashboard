'use server'

import { MESSAGES } from '@/constants/serverActions'
import type { FlightDestinationWithPrice, ServerActionResponse } from '@/types/amadeus'
import { getFlightInspirationWithLocations } from '@/utils/api/geoChart/amadeus'

export async function fetchFlightInspiration(
  city: string,
  airport: string,
): Promise<ServerActionResponse<FlightDestinationWithPrice[]>> {
  try {
    console.log('[Server Action] Fetching flight inspiration for', city)
    const { success, data, message } = await getFlightInspirationWithLocations(
      city,
      airport,
    )
    if (!success) {
      console.error('[API] Error fetching flight inspiration:', message)
      return { success, message }
    }
    return { success: true, data }
  } catch (error) {
    console.error('[API] Error:', error)
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
    }
  }
}
