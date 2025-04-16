import type {
  AmadeusEndpoint,
  FlightDestinationWithPrice,
  FlightLocation,
  ServerActionResponse,
} from '@/types/amadeus'
import type { GetDepartureLocationProps } from '@/utils/api/geoChart/getDepartureLocation'
import {
  flightData,
  mockFlightDestinationWithPriceData,
  mockFlightLocationData,
} from '../constants'
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
  flightData: [flightData[0]],
  token: 'fake token',
}

const response: ServerActionResponse<FlightDestinationWithPrice> = {
  success: true,
  data: {
    ...mockFlightDestinationWithPriceData[0],
    total: '0',
  },
}

const mockResponses = {
  amadeus: {
    success: {
      success: true,
      data: [mockFlightLocationData[0]],
    } as ServerActionResponse<FlightLocation[]>,
    error: {
      noData: {
        success: false,
        message: 'No data found',
      },
    },
  },
  serverMessages: {
    error: {
      success: false,
      requestFailed: 'request failed',
    },
  },
}
describe('getDepartureLocation', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()

    mockFetchAmadeus.mockReturnValue(mockResponses.amadeus.success)
    mockGetServerMessages.mockReturnValue(mockResponses.serverMessages.error)

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
    it('should return an error when a departure location IATA code is not found', async () => {
      mockFetchAmadeus.mockReturnValue(mockResponses.amadeus.error.noData)

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
        message: 'No departure location IATA code found',
      })
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] No departure location IATA code found',
      )
    })

    it('should return an error when fetchFromAmadeus returns unsuccessfully', async () => {
      mockFetchAmadeus.mockReturnValue(mockResponses.amadeus.error.noData)

      const { getDepartureLocation } = await import(
        '@/utils/api/geoChart/getDepartureLocation'
      )
      const result = await getDepartureLocation(input)
      expect(result).toEqual(mockResponses.amadeus.error.noData)
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] Error fetching departure location: No data found',
      )
    })

    it('should return an error when fetchFromAmadeus returns unsuccessfully without a message response', async () => {
      const mockFetchAmadeusErrorResponseUpdated = {
        success: false,
        message: '',
      }
      mockFetchAmadeus.mockReturnValue(mockFetchAmadeusErrorResponseUpdated)

      const { getDepartureLocation } = await import(
        '@/utils/api/geoChart/getDepartureLocation'
      )
      const result = await getDepartureLocation(input)
      expect(result).toEqual({
        success: false,
        message: mockResponses.serverMessages.error.requestFailed,
      })

      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] Error fetching departure location: Unknown error',
      )
    })
  })
})
