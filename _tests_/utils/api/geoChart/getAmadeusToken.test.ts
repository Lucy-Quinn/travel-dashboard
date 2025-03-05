import type {
  AmadeusAuthResponse,
  AmadeusEndpoint,
  ServerActionResponse,
} from '@/types/amadeus'
import { mockAmadeusConfig } from '../constants'

const mockMessages = {
  CONFIG_ERROR: 'Configuration error',
}
const mockAmadeusEndpoints = {
  TOKEN: 'token' as AmadeusEndpoint,
}

jest.mock('@/constants/serverActions', () => ({
  AMADEUS_CONFIG: mockAmadeusConfig,
  MESSAGES: mockMessages,
  AMADEUS_ENDPOINTS: mockAmadeusEndpoints,
}))

const mockGetServerActionMessages = jest.fn()
const mockFetchFromAmadeus = jest.fn()
jest.mock('@/utils/api/helpers', () => ({
  getServerActionMessages: mockGetServerActionMessages,
  fetchFromAmadeus: mockFetchFromAmadeus,
}))

const response: ServerActionResponse<AmadeusAuthResponse> = {
  success: true,
  data: 'fake token',
}

const mockFetchFromAmadeusResponseSuccessful = {
  success: true,
  data: { access_token: 'fake token' },
}

let mockFetchFromAmadeusResponseUnsuccessful = {
  success: false,
  message: 'Token not returned successfully',
}

const mockGetServerActionMessagesResponse = {
  success: false,
  dataInvalid: 'Invalid token',
}

describe('getAmadeusToken', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules() // Clears all imported modules from cache (including the Amadeus config)

    mockFetchFromAmadeus.mockReturnValue(mockFetchFromAmadeusResponseSuccessful)
    mockGetServerActionMessages.mockReturnValue(mockGetServerActionMessagesResponse)

    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Successful token retrieval', () => {
    it('should return data when getAmadeusToken returns successfully', async () => {
      const { getAmadeusToken } = await import('@/utils/api/geoChart/getAmadeusToken')
      const result = await getAmadeusToken()
      expect(result).toEqual(response)
      expect(result.success).toEqual(true)
      expect(result.data).toEqual('fake token')
      expect(console.log).toHaveBeenCalledWith('[Amadeus API] Token fetched successfully')
    })
  })

  describe('Amadeus configuration', () => {
    it('should return an error when Amadeus configuration is missing', async () => {
      const mockAmadeusConfigUpdated = {
        ...mockAmadeusConfig,
        clientId: '',
        clientSecret: '',
        apiUrl: '',
      }

      jest.doMock('@/constants/serverActions', () => ({
        AMADEUS_CONFIG: mockAmadeusConfigUpdated,
        MESSAGES: mockMessages,
        AMADEUS_ENDPOINTS: mockAmadeusEndpoints,
      }))

      const { getAmadeusToken } = await import('@/utils/api/geoChart/getAmadeusToken')
      const result = await getAmadeusToken()
      expect(result).toEqual({
        success: false,
        message: mockMessages.CONFIG_ERROR,
      })
      expect(console.error).toHaveBeenCalledWith(
        '[Amadeus API] Missing Amadeus configuration',
      )
    })
  })

  describe('fetchFromAmadeus calls', () => {
    it('should call fetchFromAmadeus once', async () => {
      jest.doMock('@/constants/serverActions', () => ({
        AMADEUS_CONFIG: mockAmadeusConfig,
        MESSAGES: mockMessages,
        AMADEUS_ENDPOINTS: mockAmadeusEndpoints,
      }))

      const { getAmadeusToken } = await import('@/utils/api/geoChart/getAmadeusToken')
      await getAmadeusToken()
      expect(mockFetchFromAmadeus).toHaveBeenCalledTimes(1)
    })

    it('should return an error when fetchFromAmadeus returns unsuccessfully', async () => {
      mockFetchFromAmadeus.mockReturnValue(mockFetchFromAmadeusResponseUnsuccessful)

      const { getAmadeusToken } = await import('@/utils/api/geoChart/getAmadeusToken')
      const result = await getAmadeusToken()
      expect(result).toEqual({
        success: false,
        message: mockFetchFromAmadeusResponseUnsuccessful.message,
      })
      expect(mockFetchFromAmadeus).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        `[Amadeus API] Error fetching token: ${mockFetchFromAmadeusResponseUnsuccessful.message}`,
      )
      expect(result.data).toBeUndefined()
    })

    it('should return an error when fetchFromAmadeus returns unsuccessfully and `message` is missing', async () => {
      mockFetchFromAmadeusResponseUnsuccessful = {
        ...mockFetchFromAmadeusResponseUnsuccessful,
        message: '',
      }
      mockFetchFromAmadeus.mockReturnValue(mockFetchFromAmadeusResponseUnsuccessful)

      const { getAmadeusToken } = await import('@/utils/api/geoChart/getAmadeusToken')
      await getAmadeusToken()
      expect(console.error).toHaveBeenCalledWith(
        `[Amadeus API] Error fetching token: Unknown error`,
      )
    })
  })

  describe('getServerActionMessages calls', () => {
    it('should call getServerActionMessages once when token is invalid', async () => {
      mockFetchFromAmadeus.mockReturnValue({
        success: true,
        data: {},
      })

      const { getAmadeusToken } = await import('@/utils/api/geoChart/getAmadeusToken')
      const result = await getAmadeusToken()
      expect(result).toEqual({
        success: false,
        message: 'Invalid token',
      })
      expect(mockGetServerActionMessages).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        `[Amadeus API] Error fetching token: ${mockGetServerActionMessagesResponse.dataInvalid}`,
      )
    })
    it('should handle empty `dataInvalid` response from getServerActionMessages gracefully', async () => {
      mockGetServerActionMessagesResponse.dataInvalid = ''
      mockFetchFromAmadeus.mockReturnValue({
        success: true,
        data: {},
      })

      const { getAmadeusToken } = await import('@/utils/api/geoChart/getAmadeusToken')
      await getAmadeusToken()
      expect(console.error).toHaveBeenCalledWith(
        `[Amadeus API] Error fetching token: Unknown error`,
      )
    })
  })
})
