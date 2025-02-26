'use server'

import { MESSAGES } from '@/constants/serverActions'
import type { DestinationRecommendation, ServerActionResponse } from '@/types/amadeus'
import { getRecommendedDestinations } from '@/utils/api/barChart/amadeus'

export async function fetchRecommendedDestinations(
  cityCode: string,
): Promise<ServerActionResponse<DestinationRecommendation[]>> {
  try {
    console.log('[Amadeus API] Fetching recommended destinations for city:', cityCode)

    const { success, data, message } = await getRecommendedDestinations(cityCode)
    if (!success) {
      console.error('[API] Error fetching Amadeus recommended destinations:', message)
      return { success, message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[API] Internal server error:', error)

    return {
      success: false,
      message: error instanceof Error ? error.message : MESSAGES.INTERNAL_ERROR,
    }
  }
}
