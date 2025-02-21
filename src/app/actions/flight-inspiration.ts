'use server'

import { MESSAGES } from '@/constants/serverActions'
import type { FlightDestinationWithPrice, ServerActionResponse } from '@/types/amadeus'
import { getFlightInspirationWithLocations } from '@/utils/api/amadeus'

export async function fetchFlightInspiration(): Promise<
  ServerActionResponse<FlightDestinationWithPrice>
> {
  try {
    return await getFlightInspirationWithLocations('MAD')
  } catch (error) {
    console.error('[API] Error:', error)
    return {
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
    }
  }
}
