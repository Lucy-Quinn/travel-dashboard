import type {
  AmadeusEndpoint,
  FlightIataCodeAndPrice,
  FlightInspiration,
  ServerActionResponse,
} from '@/types/amadeus'
import { GetFlightInspirationProps } from '@/utils/api'
import {
  mockFlightData,
  mockFlightInspirationData,
  mockFlightInspirationDataWithAirport,
} from '../constants'

const mockAmadeusEndpoints = {
  FLIGHT_INSPIRATION: 'flight-inspiration' as AmadeusEndpoint,
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

const mockResponses = {
  amadeus: {
    success: {
      success: true,
      data: mockFlightInspirationData,
    } as ServerActionResponse<FlightInspiration[]>,
    error: {
      noData: {
        success: false,
        message: 'No data found',
      },
    },
  },
  serverMessages: {
    error: {
      requestFailed: {
        success: false,
        requestFailed: 'request failed',
      },
      dataInvalid: {
        success: true,
        dataInvalid: 'data invalid',
      },
    },
  },
}

describe('getFlightInspiration', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()

    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('by city', () => {
    const input: GetFlightInspirationProps = {
      city: 'MIA',
      airport: undefined,
      token: 'fake token',
    }

    const response: ServerActionResponse<FlightIataCodeAndPrice[]> = {
      success: true,
      data: [
        {
          iataCode: 'MIA',
          total: '0',
        },
        ...mockFlightData,
      ],
    }
    describe('successful retrieval', () => {
      it('should return data when getFlightInspiration returns successfully based on a city', async () => {
        mockFetchAmadeus.mockReturnValue(mockResponses.amadeus.success)

        const { getFlightInspiration } = await import(
          '@/utils/api/geoChart/getFlightInspiration'
        )

        const result = await getFlightInspiration(input)

        expect(result).toEqual(response)
        expect(console.log).toHaveBeenCalledWith(
          `[Amadeus API] Fetching flight inspiration search results from origin: ${input.city}`,
        )
        expect(console.log).toHaveBeenCalledWith(
          `[Amadeus API] Flight inspiration data fetched successfully`,
        )
      })
    })
    describe('error handling', () => {
      it('should return an error when fetchAmadeus returns unsuccessfully', async () => {
        mockFetchAmadeus.mockReturnValue(mockResponses.amadeus.error.noData)

        const { getFlightInspiration } = await import(
          '@/utils/api/geoChart/getFlightInspiration'
        )

        const result = await getFlightInspiration(input)

        expect(result).toEqual({
          success: false,
          message: mockResponses.amadeus.error.noData.message,
        })
        expect(console.error).toHaveBeenCalledWith(
          '[Amadeus API] Error fetching flight inspiration:',
          mockResponses.amadeus.error.noData.message,
        )
      })

      it('should return an error when fetchAmadeus returns unsuccessfully without a message response', async () => {
        mockFetchAmadeus.mockReturnValue({
          success: false,
          message: '',
        })

        mockGetServerMessages.mockReturnValue(
          mockResponses.serverMessages.error.requestFailed,
        )

        const { getFlightInspiration } = await import(
          '@/utils/api/geoChart/getFlightInspiration'
        )

        const result = await getFlightInspiration(input)

        expect(result).toEqual({
          success: false,
          message: mockResponses.serverMessages.error.requestFailed.requestFailed,
        })
        expect(console.error).toHaveBeenCalledWith(
          '[Amadeus API] Error fetching flight inspiration:',
          mockResponses.serverMessages.error.requestFailed.requestFailed,
        )
      })

      it('should return an error when fetchAmadeus returns successfully but the data is an empty array', async () => {
        mockFetchAmadeus.mockReturnValue({
          success: true,
          data: [],
        } as ServerActionResponse<FlightInspiration[]>)

        mockGetServerMessages.mockReturnValue(
          mockResponses.serverMessages.error.dataInvalid,
        )

        const { getFlightInspiration } = await import(
          '@/utils/api/geoChart/getFlightInspiration'
        )

        const result = await getFlightInspiration(input)

        expect(result).toEqual({
          success: true,
          message: mockResponses.serverMessages.error.dataInvalid.dataInvalid,
        })
        expect(console.error).toHaveBeenCalledWith(
          '[Amadeus API] Error fetching flight inspiration:',
          mockResponses.serverMessages.error.dataInvalid.dataInvalid,
        )
      })
    })
  })

  describe('by airport', () => {
    describe('successful retrieval', () => {
      it('should return data when getFlightInspiration returns successfully based on a airport', async () => {
        const inputWithAirport = {
          city: 'LON',
          token: 'fake token',
          airport: 'LHR',
        }

        const responseWithAirport: ServerActionResponse<FlightIataCodeAndPrice[]> = {
          success: true,
          data: [
            {
              iataCode: 'LHR',
              total: '0',
            },
            ...mockFlightData,
          ],
        }
        mockFetchAmadeus.mockReturnValue({
          success: true,
          data: mockFlightInspirationDataWithAirport,
        } as ServerActionResponse<FlightInspiration[]>)

        const { getFlightInspiration } = await import(
          '@/utils/api/geoChart/getFlightInspiration'
        )

        const result = await getFlightInspiration(inputWithAirport)

        expect(result).toEqual(responseWithAirport)
        expect(console.log).toHaveBeenCalledWith(
          `[Amadeus API] Fetching flight inspiration search results from origin: ${inputWithAirport.city}`,
        )
        expect(console.log).toHaveBeenCalledWith(
          `[Amadeus API] Flight inspiration data fetched successfully`,
        )
      })
    })
    describe('error handling', () => {
      it('should return an error when there is no data for the specific airport', async () => {
        const inputWithAirport = {
          city: 'NYC',
          token: 'fake token',
          airport: 'JFK',
        }
        mockFetchAmadeus.mockReturnValue({
          success: true,
          data: mockFlightInspirationDataWithAirport,
        } as ServerActionResponse<FlightInspiration[]>)

        const { getFlightInspiration } = await import(
          '@/utils/api/geoChart/getFlightInspiration'
        )

        const result = await getFlightInspiration(inputWithAirport)

        expect(result).toEqual({
          success: false,
          message: `No flight inspiration found for airport: ${inputWithAirport.airport}`,
        })
        expect(console.error).toHaveBeenCalledWith(
          `[Amadeus API] Error fetching flight inspiration for airport: ${inputWithAirport.airport}`,
        )
      })
    })
  })
})
