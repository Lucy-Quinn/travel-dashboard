import type {
  AmadeusEndpoint,
  DestinationRecommendation,
  ServerActionResponse,
} from '@/types/amadeus'

jest.mock('@/constants/serverActions', () => ({
  MESSAGES: mockMessages,
  AMADEUS_ENDPOINTS: mockAmadeusEndpoints,
}))

const mockFetchFromAmadeus = jest.fn()
jest.mock('@/utils/api/helpers', () => ({
  fetchFromAmadeus: mockFetchFromAmadeus,
}))

const mockGetAmadeusToken = jest.fn()
jest.mock('@/utils/api/geoChart/getAmadeusToken', () => ({
  getAmadeusToken: mockGetAmadeusToken,
}))

const mockMessages = {
  FETCH_RECOMMENDED_DESTINATIONS_REQUEST_FAILED: 'Failed to fetch API endpoint.',
}
const mockAmadeusEndpoints = {
  RECOMMENDED_DESTINATIONS: 'fake endpoint type' as AmadeusEndpoint,
}

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
const mockGetAmadeusTokenResponseSuccessful = {
  success: true,
  data: 'fake token',
}

const mockGetAmadeusTokenResponseUnsuccessful = {
  success: false,
  data: '',
  message: 'Token not returned successfully',
}

const mockFetchFromAmadeusResponseSuccessful = {
  success: true,
  data: {
    data: response.data,
  },
}

let mockFetchFromAmadeusResponseUnsuccessful = {
  success: false,
  message: 'Data not returned successfully',
}

describe('getDestinationRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    mockGetAmadeusToken.mockReturnValue(mockGetAmadeusTokenResponseSuccessful)
    mockFetchFromAmadeus.mockReturnValue(mockFetchFromAmadeusResponseSuccessful)
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
      mockGetAmadeusToken.mockReturnValue(mockGetAmadeusTokenResponseUnsuccessful)
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
      expect(mockFetchFromAmadeus).toHaveBeenCalledTimes(1)
      expect(mockFetchFromAmadeus).toHaveBeenCalledWith({
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
      mockFetchFromAmadeus.mockReturnValue(mockFetchFromAmadeusResponseUnsuccessful)
      const result = await getRecommendedDestinations(inputCity)

      expect(result).toStrictEqual(response)
      expect(mockFetchFromAmadeus).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        `[API] Error fetching Amadeus recommended destinations: ${mockFetchFromAmadeusResponseUnsuccessful.message}`,
      )
    })

    it('should return an error when fetchFromAmadeus returns unsuccessfully and `message` is missing', async () => {
      mockFetchFromAmadeusResponseUnsuccessful = {
        success: false,
        message: '',
      }

      response = {
        success: false,
        message: mockMessages.FETCH_RECOMMENDED_DESTINATIONS_REQUEST_FAILED,
      }
      const { getRecommendedDestinations } = await import('@/utils/api/barChart')
      mockFetchFromAmadeus.mockReturnValue(mockFetchFromAmadeusResponseUnsuccessful)
      const result = await getRecommendedDestinations(inputCity)

      expect(result).toStrictEqual(response)
      expect(mockFetchFromAmadeus).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        `[API] Error fetching Amadeus recommended destinations: Unknown error`,
      )
    })
  })
})
