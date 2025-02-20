export const AMADEUS_CONFIG = {
  clientId: process.env.API_KEY,
  clientSecret: process.env.API_SECRET,
  apiUrl: process.env.AMADEUS_API_URL,
}

export const MESSAGES = {
  CONFIG_ERROR: 'Server configuration error',
  INTERNAL_ERROR: 'An error occurred',

  // Token
  FETCH_TOKEN_FAILED: 'Failed to fetch API token. Please try again.',
  FETCH_TOKEN_SUCCESS: 'API token fetched successfully',

  // Recommended Destinations
  FETCH_RECOMMENDED_DESTINATIONS_REQUEST_FAILED:
    'Failed to request Amadeus API recommended destinations. Please try again.',
  FETCH_RECOMMENDED_DESTINATIONS_DATA_INVALID:
    'Invalid data received from Amadeus API recommended destinations. Please try again.',
  FETCH_RECOMMENDED_DESTINATIONS_FAILED:
    'Failed to fetch Amadeus API recommended destinations. Please try again.',
  FETCH_RECOMMENDED_DESTINATIONS_SUCCESS:
    'Amadeus API recommended destinations fetched successfully',

  // Flight Inspiration
  FETCH_FLIGHT_INSPIRATION_REQUEST_FAILED:
    'Failed to request Amadeus API flight inspiration. Please try again.',
  FETCH_FLIGHT_INSPIRATION_DATA_INVALID:
    'Invalid data received from Amadeus API flight inspiration. Please try again.',

  // Flight Location Details
  FETCH_FLIGHT_LOCATION_DETAILS_REQUEST_FAILED:
    'Failed to request Amadeus API flight location details. Please try again.',
  FETCH_FLIGHT_LOCATION_DETAILS_DATA_INVALID:
    'Invalid data received from Amadeus API flight location details. Please try again.',

  //   FETCH_FLIGHT_INSPIRATION_SUCCESS: 'Amadeus API flight inspiration fetched successfully',

  FETCH_FLIGHT_DETAILS_FAILED:
    'Failed to fetch Amadeus API flight details. Please try again.',
} as const
