export const AMADEUS_CONFIG = {
  clientId: process.env.API_KEY,
  clientSecret: process.env.API_SECRET,
  apiUrl: process.env.AMADEUS_API_URL,
}

export const MESSAGES = {
  CONFIG_ERROR: 'Server configuration error',
  INTERNAL_ERROR: 'An error occurred',
  FETCH_TOKEN_FAILED: 'Failed to fetch API token. Please try again.',
  FETCH_TRAVEL_DATA_FAILED: 'Failed to fetch API travel data. Please try again.',
} as const
