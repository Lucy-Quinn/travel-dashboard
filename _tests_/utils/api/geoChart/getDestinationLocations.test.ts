import type {
  AmadeusEndpoint,
  FlightDestinationWithPrice,
  FlightLocation,
  ServerActionResponse,
} from '@/types/amadeus'
import { GetDestinationLocationsProps } from '@/utils/api/geoChart/getDestinationLocations'
import {
  mockFlightData as flightData,
  mockFlightDestinationWithPriceData,
  mockFlightLocationData,
} from '../constants'

const mockAmadeusEndpoints = {
  DESTINATION_LOCATIONS: 'destination-locations' as AmadeusEndpoint,
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

const input: GetDestinationLocationsProps = {
  flightData,
  token: 'fake token',
}

const response: ServerActionResponse<FlightDestinationWithPrice[]> = {
  success: true,
  data: mockFlightDestinationWithPriceData,
}

const mockResponses = {
  amadeus: {
    success: {
      first: {
        success: true,
        data: [mockFlightLocationData[0]],
      } as ServerActionResponse<FlightLocation[]>,
      second: {
        success: true,
        data: [mockFlightLocationData[1]],
      } as ServerActionResponse<FlightLocation[]>,
    },
    error: {
      noData: {
        success: false,
        message: 'No data found',
      },
    },
  },
  serverMessages: {
    error: {
      dataInvalid: {
        success: false,
        dataInvalid: 'request failed',
      },
    },
  },
}

describe('getDestinationLocations', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()

    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Successful destination locations retrieval', () => {
    it('should return data when getDestinationLocations returns successfully', async () => {
      mockFetchAmadeus
        .mockReturnValueOnce(mockResponses.amadeus.success.first)
        .mockReturnValueOnce(mockResponses.amadeus.success.second)

      const { getDestinationLocations } = await import(
        '@/utils/api/geoChart/getDestinationLocations'
      )

      const result = await getDestinationLocations(input)
      expect(result).toEqual(response)
      expect(console.log).toHaveBeenCalledWith(
        '[Amadeus API] Destination locations fetched successfully',
      )
    })
  })

  describe('Error handling', () => {
    it('should return an error when fetchAmadeus returns unsuccessfully', async () => {
      mockFetchAmadeus.mockReturnValue(mockResponses.amadeus.error.noData)

      const { getDestinationLocations } = await import(
        '@/utils/api/geoChart/getDestinationLocations'
      )

      const result = await getDestinationLocations(input)

      expect(result).toEqual(mockResponses.amadeus.error.noData)
      expect(console.log).toHaveBeenCalledWith(
        '[Amadeus API] Fetching destination locations',
      )
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] Error fetching destination locations:',
        mockResponses.amadeus.error.noData.message,
      )
    })

    it('should return an error when fetchAmadeus returns unsuccessfully without a message response', async () => {
      mockFetchAmadeus.mockReturnValue({
        ...mockResponses.amadeus.error.noData,
        message: '',
      })

      const { getDestinationLocations } = await import(
        '@/utils/api/geoChart/getDestinationLocations'
      )

      const result = await getDestinationLocations(input)

      expect(result).toEqual({
        ...mockResponses.amadeus.error.noData,
        message: 'Failed to fetch destination locations',
      })
      expect(console.log).toHaveBeenCalledWith(
        '[Amadeus API] Fetching destination locations',
      )
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] Error fetching destination locations:',
        'Failed to fetch destination locations',
      )
    })

    it('should return an error when location details geoCode is not found', async () => {
      mockFetchAmadeus.mockReturnValue({
        success: true,
        data: [
          {
            ...mockFlightLocationData[0],
            geoCode: undefined,
          },
        ],
      })

      mockGetServerMessages.mockReturnValue(
        mockResponses.serverMessages.error.dataInvalid,
      )

      const { getDestinationLocations } = await import(
        '@/utils/api/geoChart/getDestinationLocations'
      )

      const result = await getDestinationLocations(input)

      expect(result).toEqual({
        success: false,
        message: mockResponses.serverMessages.error.dataInvalid.dataInvalid,
      })
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] Error fetching destination locations:',
        mockResponses.serverMessages.error.dataInvalid.dataInvalid,
      )
    })

    it('should return an error when location details iataCode and cityCode does not match the flight data iataCode', async () => {
      mockFetchAmadeus.mockReturnValue({
        success: true,
        data: [
          {
            ...mockFlightLocationData[0],
            iataCode: 'AGP',
            address: {
              ...mockFlightLocationData[0].address,
              cityCode: 'AGP',
            },
          },
        ],
      })

      mockGetServerMessages.mockReturnValue(
        mockResponses.serverMessages.error.dataInvalid,
      )

      const { getDestinationLocations } = await import(
        '@/utils/api/geoChart/getDestinationLocations'
      )

      const result = await getDestinationLocations(input)

      expect(result).toEqual({
        success: false,
        message: mockResponses.serverMessages.error.dataInvalid.dataInvalid,
      })
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] Error fetching destination locations:',
        mockResponses.serverMessages.error.dataInvalid.dataInvalid,
      )
    })

    it('should return an error when location details data is undefined', async () => {
      mockFetchAmadeus.mockReturnValue({
        success: true,
        data: undefined,
      })

      mockGetServerMessages.mockReturnValue(
        mockResponses.serverMessages.error.dataInvalid,
      )

      const { getDestinationLocations } = await import(
        '@/utils/api/geoChart/getDestinationLocations'
      )

      const result = await getDestinationLocations(input)

      expect(result).toEqual({
        success: false,
        message: mockResponses.serverMessages.error.dataInvalid.dataInvalid,
      })
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] Error fetching destination locations:',
        mockResponses.serverMessages.error.dataInvalid.dataInvalid,
      )
    })
  })
})
