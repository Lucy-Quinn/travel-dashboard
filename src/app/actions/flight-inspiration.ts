'use server'

import { MESSAGES } from '@/constants/serverActions'
import type { FlightDestinationWithPrice, ServerActionResponse } from '@/types/amadeus'
import { getFlightInspirationWithLocations } from '@/utils/api/mapChart.ts/amadeus'

export async function fetchFlightInspiration(
  city: string,
): Promise<ServerActionResponse<FlightDestinationWithPrice>> {
  try {
    console.log('[Server Action] Fetching flight inspiration for', city)
    return await getFlightInspirationWithLocations(city)
  } catch (error) {
    console.error('[API] Error:', error)
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
    }
  }
}
