import type {
  AmadeusEndpoint,
  DestinationRecommendation,
  ServerActionResponse,
} from '@/types/amadeus'

const mockAmadeusEndpoints = {
  RECOMMENDED_DESTINATIONS: 'fake endpoint type' as AmadeusEndpoint,
}
jest.mock('@/constants/serverActions', () => ({
  AMADEUS_ENDPOINTS: mockAmadeusEndpoints,
}))

const mockFetchAmadeus = jest.fn()
const mockGetServerMessages = jest.fn()
jest.mock('@/utils/api/helpers', () => ({
  getServerActionMessages: mockGetServerMessages,
  fetchFromAmadeus: mockFetchAmadeus,
}))

const mockGetAmadeusToken = jest.fn()
jest.mock('@/utils/api/geoChart/getAmadeusToken', () => ({
  getAmadeusToken: mockGetAmadeusToken,
}))

const inputCity = 'MAD'
let response: ServerActionResponse<DestinationRecommendation> = {
  success: true,
  data: {
    subtype: 'fake subtype',
    name: 'fake name',
    iataCode: 'fake iataCode',
    geoCode: {
      latitude: 0,
      longitude: 0,
    },
    type: 'fake type',
    relevance: 0,
  },
}

// Mock responses
const mockGetAmadeusTokenResponse = {
  success: true,
  data: 'fake token',
}

const mockGetAmadeusTokenErrorResponse = {
  success: false,
  data: '',
  message: 'Token not returned successfully',
}

const mockFetchAmadeusSuccessResponse = {
  success: true,
  data: response.data,
}

const mockFetchAmadeusErrorResponse = {
  success: false,
  message: 'Data not returned successfully',
}

const mockGetServerMessagesResponse = {
  success: false,
  requestFailed: 'request failed',
}

describe('getDestinationRecommendations', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()

    mockGetAmadeusToken.mockReturnValue(mockGetAmadeusTokenResponse)
    mockFetchAmadeus.mockReturnValue(mockFetchAmadeusSuccessResponse)
    mockGetServerMessages.mockReturnValue(mockGetServerMessagesResponse)

    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return data when fetchFromAmadeus returns successfully', async () => {
    const { getRecommendedDestinations } = await import('@/utils/api/barChart')
    const result = await getRecommendedDestinations(inputCity)
    expect(result).toStrictEqual(response)
    expect(result.success).toStrictEqual(true)
  })

  describe('getAmadeusToken calls', () => {
    it('should call getAmadeusToken once', async () => {
      const { getRecommendedDestinations } = await import('@/utils/api/barChart')
      await getRecommendedDestinations(inputCity)
      expect(mockGetAmadeusToken).toHaveBeenCalledTimes(1)
    })
    it('should return an error when token is not returned successfully', async () => {
      response = {
        success: false,
        message: 'Token not returned successfully',
      }
      const { getRecommendedDestinations } = await import('@/utils/api/barChart')
      mockGetAmadeusToken.mockReturnValue(mockGetAmadeusTokenErrorResponse)
      const result = await getRecommendedDestinations(inputCity)

      expect(result).toStrictEqual(response)
      expect(mockGetAmadeusToken).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        `[Amadeus API] Error fetching token: ${response.message}`,
      )
    })
  })

  describe('fetchFromAmadeus calls', () => {
    it('should call fetchFromAmadeus once', async () => {
      const { getRecommendedDestinations } = await import('@/utils/api/barChart')
      await getRecommendedDestinations(inputCity)
      expect(mockFetchAmadeus).toHaveBeenCalledTimes(1)
      expect(mockFetchAmadeus).toHaveBeenCalledWith({
        endpoint: `/reference-data/recommended-locations?cityCodes=${inputCity}`,
        token: 'fake token',
        options: {},
        endpointType: 'fake endpoint type',
      })
    })
    it('should return an error when fetchFromAmadeus returns unsuccessfully', async () => {
      response = {
        success: false,
        message: 'Data not returned successfully',
      }
      const { getRecommendedDestinations } = await import('@/utils/api/barChart')
      mockFetchAmadeus.mockReturnValue(mockFetchAmadeusErrorResponse)
      const result = await getRecommendedDestinations(inputCity)

      expect(result).toStrictEqual(response)
      expect(mockFetchAmadeus).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        `[API] Error fetching Amadeus recommended destinations: ${mockFetchAmadeusErrorResponse.message}`,
      )
    })

    it('should return an error when fetchFromAmadeus returns unsuccessfully and `message` is missing', async () => {
      const mockFetchAmadeusErrorResponseUpdated = {
        ...mockFetchAmadeusErrorResponse,
        message: '',
      }

      const responseUpdated = {
        success: false,
        message: mockGetServerMessagesResponse.requestFailed,
      }

      const { getRecommendedDestinations } = await import('@/utils/api/barChart')
      mockFetchAmadeus.mockReturnValue(mockFetchAmadeusErrorResponseUpdated)
      const result = await getRecommendedDestinations(inputCity)

      expect(result).toStrictEqual(responseUpdated)
      expect(mockFetchAmadeus).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        `[API] Error fetching Amadeus recommended destinations: Unknown error`,
      )
    })
  })

  it('should return an empty array when data is undefined', async () => {
    const mockFetchAmadeusSuccessResponseUpdated = {
      ...mockFetchAmadeusSuccessResponse,
      data: undefined,
    }
    mockFetchAmadeus.mockReturnValue(mockFetchAmadeusSuccessResponseUpdated)

    const { getRecommendedDestinations } = await import('@/utils/api/barChart')
    const result = await getRecommendedDestinations(inputCity)

    expect(result).toEqual({
      success: true,
      data: [],
    })
  })
})
