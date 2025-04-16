export const mockAmadeusConfig = {
  clientId: 'fakeClientId',
  clientSecret: 'fakeClientSecret',
  apiUrl: 'fakeApiUrl',
}

export const flightData = [
  {
    iataCode: 'MAD',
    total: '100',
  },
  {
    iataCode: 'FCO',
    total: '81.19',
  },
]

export const mockFlightDestinationWithPriceData = [
  {
    airportName: 'Madrid Barajas Airport',
    cityName: 'Madrid',
    geoCode: {
      latitude: 40.4719,
      longitude: -3.5626,
    },
    ...flightData[0],
  },
  {
    airportName: 'Rome FCO Airport',
    cityName: 'Rome',
    geoCode: {
      latitude: 41.8003,
      longitude: 12.2388,
    },
    ...flightData[1],
  },
]

export const mockFlightLocationData = [
  {
    type: 'airport',
    subType: 'airport',
    name: 'Madrid Barajas Airport',
    detailedName: 'Madrid Barajas Airport',
    id: 'MAD',
    iataCode: 'MAD',
    geoCode: {
      latitude: 40.4719,
      longitude: -3.5626,
    },
    address: {
      cityName: 'Madrid',
      cityCode: 'MAD',
      countryName: 'Spain',
      countryCode: 'ES',
      regionCode: 'MD',
    },
  },
  {
    type: 'airport',
    subType: 'airport',
    name: 'Rome FCO Airport',
    detailedName: 'Rome FCO Airport',
    id: 'FCO',
    iataCode: 'FCO',
    geoCode: {
      latitude: 41.8003,
      longitude: 12.2388,
    },
    address: {
      cityName: 'Rome',
      cityCode: 'FCO',
      countryName: 'Italy',
      countryCode: 'IT',
      regionCode: 'RM',
    },
  },
]
