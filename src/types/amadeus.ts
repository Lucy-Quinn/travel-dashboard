export type AmadeusResponse = {
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
