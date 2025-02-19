export type AmadeusAPIResponse = {
  success: boolean
  message?: string
  data?: { data: AmadeusDestinationRecommendation[] }
}

export type AmadeusAuthResponse = {
  state?: boolean
  access_token?: string
  error_description?: string
}

export type AmadeusDestinationResponse = {
  data: AmadeusDestinationRecommendation[]
  error_description?: string
}

export type AmadeusDestinationRecommendation = {
  subtype: string
  name: string
  iataCode: string
  geoCode: {
    latitude: number
    longitude: number
  }
  type: string
  relevance: number
}
