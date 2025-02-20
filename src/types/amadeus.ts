// // Server action responses
// export type ServerActionResponse<T> = {
//     success: boolean
//     message?: string
//     data?: AmadeusResponse<T>
//   }

export type AmadeusAPIResponse<T> = {
  success: boolean
  message?: string
  data?: T[]
}

export type AmadeusAuthResponse = {
  state?: boolean
  access_token?: string
  error_description?: string
}

export type AmadeusDestinationResponse<T> = {
  data: T[]
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

export type AmadeusFlightInspiration = {
  type: string
  origin: string
  destination: string
  departureDate: string
  returnDate: string
  price: {
    total: number
  }
}

export type AmadeusFlightInspirationResponse = {
  destination: string
  total: number
  geoCode: {
    latitude: number
    longitude: number
  }
}

// export type AmadeusFlightLocationDetails = {
//   type: string
//   subType: string
//   name: string
//   detailedName: string
//   id: string
//   iataCode: string
//   geoCode: {
//     latitude: number
//     longitude: number
//   }
//   address: {
//     cityName: string
//     cityCode: string
//     countryName: string
//     countryCode: string
//     regionCode: string
//   }
// }
