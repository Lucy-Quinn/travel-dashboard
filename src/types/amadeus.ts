import { AMADEUS_ENDPOINTS } from '@/constants/serverActions'

export type ServerActionResponse<T> = {
  success: boolean
  message?: string
  data?: T
}

export type AmadeusAPIResponse<T> = {
  data: T[] | T
  errors?: {
    title: string
    detail: string
  }[]
}

export type AmadeusAuthResponse = {
  access_token: AccessToken
}

export type AccessToken = string

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
    total: string
  }
}

export type FlightDestinationPrice = {
  iataCode: string
  total: string
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
  total: string
  geoCode: {
    latitude: number
    longitude: number
  }
}

export type AmadeusEndpoint = (typeof AMADEUS_ENDPOINTS)[keyof typeof AMADEUS_ENDPOINTS]
