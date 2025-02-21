export type ServerActionResponse<T> = {
  success: boolean
  message?: string
  data?: T[]
}

export type AmadeusAPIResponse<T> = {
  data: T[]
  error_description?: string
}

export type AmadeusAuthResponse = {
  state?: boolean
  access_token?: string
  error_description?: string
}

export type DestinationRecommendation = {
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

export type FlightInspiration = {
  type: string
  origin: string
  destination: string
  departureDate: string
  returnDate: string
  price: {
    total: number
  }
}

export type FlightLocation = {
  type: string
  subType: string
  name: string
  detailedName: string
  id: string
  iataCode: string
  geoCode: {
    latitude: number
    longitude: number
  }
  address: {
    cityName: string
    cityCode: string
    countryName: string
    countryCode: string
    regionCode: string
  }
}

export type FlightDestinationWithPrice = {
  airportName: string
  iataCode: string
  cityName: string
  total: number
  geoCode: {
    latitude: number
    longitude: number
  }
}
