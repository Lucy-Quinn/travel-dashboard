import type {
  AmadeusEndpoint,
  FlightDestinationWithPrice,
  FlightLocation,
  ServerActionResponse,
} from '@/types/amadeus'
import type { GetDepartureLocationProps } from '@/utils/api/geoChart/getDepartureLocation'

const mockAmadeusEndpoints = {
  DEPARTURE_LOCATION: 'departure-location' as AmadeusEndpoint,
}
jest.mock('@/constants/serverActions', () => ({
  AMADEUS_ENDPOINTS: mockAmadeusEndpoints,
}))

const mockGetServerMessages = jest.fn()
const mockFetchAmadeus = jest.fn()
jest.doMock('@/utils/api/helpers', () => ({
  getServerActionMessages: mockGetServerMessages,
  fetchFromAmadeus: mockFetchAmadeus,
}))

const input: GetDepartureLocationProps = {
  departureLocation: 'MAD',
  flightData: [
    {
      iataCode: 'MAD',
      total: '100',
    },
  ],
  token: 'fake token',
}

const response: ServerActionResponse<FlightDestinationWithPrice> = {
  success: true,
  data: {
    airportName: 'Madrid Barajas Airport',
    cityName: 'Madrid',
    geoCode: {
      latitude: 40.4719,
      longitude: -3.5626,
    },
    iataCode: 'MAD',
    total: '0',
  },
}

let mockFetchAmadeusSuccessResponse: ServerActionResponse<FlightLocation[]> = {
  success: true,
  data: [
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
  ],
}

let mockFetchAmadeusErrorResponse = {
  success: false,
  message: 'No data found',
}

let mockGetServerMessagesResponse = {
  success: false,
  dataInvalid: 'Invalid token',
}

describe('getDepartureLocation', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()

    mockFetchAmadeus.mockReturnValue(mockFetchAmadeusSuccessResponse)
    mockGetServerMessages.mockReturnValue(mockGetServerMessagesResponse)

    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Successful departure location retrieval', () => {
    it('should return data when getDepartureLocation returns successfully', async () => {
      const { getDepartureLocation } = await import(
        '@/utils/api/geoChart/getDepartureLocation'
      )
      const result = await getDepartureLocation(input)
      expect(result).toEqual(response)
      expect(console.log).toHaveBeenCalledWith(
        '[Amadeus API] Departure location details fetched successfully',
      )
    })
  })

  describe('Error handling', () => {
    it('should return an error when a departure location is not found', async () => {
      mockFetchAmadeus.mockReturnValue(mockFetchAmadeusErrorResponse)

      const newInput = {
        ...input,
        departureLocation: 'LON',
      }
      const { getDepartureLocation } = await import(
        '@/utils/api/geoChart/getDepartureLocation'
      )
      const result = await getDepartureLocation(newInput)
      expect(result).toEqual({
        success: false,
        message: mockGetServerMessagesResponse.dataInvalid,
      })
      expect(mockGetServerMessages).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] No departure location IATA code found',
      )
    })

    it('should return an error when fetchFromAmadeus returns unsuccessfully', async () => {
      mockFetchAmadeus.mockReturnValue(mockFetchAmadeusErrorResponse)

      const { getDepartureLocation } = await import(
        '@/utils/api/geoChart/getDepartureLocation'
      )
      const result = await getDepartureLocation(input)
      expect(result).toEqual({
        success: false,
        message: mockFetchAmadeusErrorResponse.message,
      })
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] Error fetching departure location: No data found',
      )
    })

    it('should return an error when fetchFromAmadeus returns unsuccessfully without a message', async () => {
      mockFetchAmadeusErrorResponse = {
        success: false,
        message: '',
      }
      mockFetchAmadeus.mockReturnValue(mockFetchAmadeusErrorResponse)

      const { getDepartureLocation } = await import(
        '@/utils/api/geoChart/getDepartureLocation'
      )
      const result = await getDepartureLocation(input)
      expect(result).toEqual({
        success: false,
        message: mockFetchAmadeusErrorResponse.message,
      })
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] Error fetching departure location: Unknown error',
      )
    })

    it('should return an error when no location data is found', async () => {
      mockFetchAmadeusSuccessResponse = {
        success: true,
        data: [],
      }
      mockFetchAmadeus.mockReturnValue(mockFetchAmadeusSuccessResponse)

      const { getDepartureLocation } = await import(
        '@/utils/api/geoChart/getDepartureLocation'
      )
      const result = await getDepartureLocation(input)
      expect(result).toEqual({
        success: false,
        message: mockGetServerMessagesResponse.dataInvalid,
      })
      expect(mockGetServerMessages).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        `[Amadeus API] No location data found for departure location: ${mockGetServerMessagesResponse.dataInvalid}`,
      )
    })

    it('should return an error when no location data is found without a message', async () => {
      mockFetchAmadeusSuccessResponse = {
        success: true,
      }
      mockFetchAmadeus.mockReturnValue(mockFetchAmadeusSuccessResponse)
      mockGetServerMessagesResponse = {
        success: false,
        dataInvalid: '',
      }
      mockGetServerMessages.mockReturnValue(mockGetServerMessagesResponse)

      const { getDepartureLocation } = await import(
        '@/utils/api/geoChart/getDepartureLocation'
      )
      const result = await getDepartureLocation(input)
      expect(result).toEqual({
        success: false,
        message: mockGetServerMessagesResponse.dataInvalid,
      })
      expect(mockGetServerMessages).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] No location data found for departure location: Unknown error',
      )
    })
  })
})
