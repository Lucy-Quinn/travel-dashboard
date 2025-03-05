import type { AmadeusEndpoint } from '@/types/amadeus'
import { mockAmadeusConfig } from './constants'

jest.mock('@/constants/serverActions', () => ({
  AMADEUS_CONFIG: mockAmadeusConfig,
  MESSAGES: mockMessages,
  AMADEUS_ENDPOINTS: mockAmadeusEndpoints,
}))

// Shared constants (used by both functions)
const mockMessages = {
  FETCH_TOKEN_REQUEST_FAILED: 'Failed to fetch API endpoint.',
  FETCH_TOKEN_DATA_INVALID: 'Invalid data received from API endpoint.',
}
const mockAmadeusEndpoints = {
  TOKEN: 'token' as AmadeusEndpoint,
}

// Constants specific to fetchFromAmadeus()
let fetchFromAmadeusInput = {
  endpoint: 'fakeEndpoint',
  token: 'fakeToken',
  options: {},
  endpointType: mockAmadeusEndpoints.TOKEN,
}
const responseData = { data: ['fakeData'] }
const successfulResponse = { success: true, data: responseData }
const unsuccessfulResponseData = {
  errors: [{ title: 'Unauthorized', detail: 'Invalid token' }],
}
let unsuccessfulResponse = {
  success: false,
  message: unsuccessfulResponseData.errors[0].detail,
}

describe('API Helpers', () => {
  describe('getServerActionMessages', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return the correct messages for the token endpoint', async () => {
      const input: AmadeusEndpoint = mockAmadeusEndpoints.TOKEN
      const { getServerActionMessages } = await import('@/utils/api/helpers')

      const result = getServerActionMessages(input)
      expect(result).toStrictEqual({
        requestFailed: mockMessages.FETCH_TOKEN_REQUEST_FAILED,
        dataInvalid: mockMessages.FETCH_TOKEN_DATA_INVALID,
      })
    })

    it('should return undefined for an unhandled AmadeusEndpoint', async () => {
      const { getServerActionMessages } = await import('@/utils/api/helpers')

      const unknownEndpoint = 'UNKNOWN_ENDPOINT' as AmadeusEndpoint

      const result = getServerActionMessages(unknownEndpoint)
      expect(result).toBeUndefined()
    })
  })

  describe('fetchFromAmadeus', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    describe('Successful Fetch Requests', () => {
      it('should return data on successful fetch', async () => {
        const { fetchFromAmadeus } = await import('@/utils/api/helpers')

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(responseData),
          }),
        ) as jest.Mock

        const result = await fetchFromAmadeus(fetchFromAmadeusInput)
        expect(result).toEqual(successfulResponse)
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(
          `${mockAmadeusConfig.apiUrl}${fetchFromAmadeusInput.endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${fetchFromAmadeusInput.token}`,
              'Content-Type': 'application/json',
            },
          },
        )
      })

      it('should return the data with the token when there is no token provided', async () => {
        const { fetchFromAmadeus } = await import('@/utils/api/helpers')

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(responseData),
          }),
        ) as jest.Mock

        fetchFromAmadeusInput = {
          ...fetchFromAmadeusInput,
          token: '',
          options: {
            body: 'fake options body',
          },
        }

        const result = await fetchFromAmadeus(fetchFromAmadeusInput)
        expect(result).toEqual(successfulResponse)
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(
          `${mockAmadeusConfig.apiUrl}${fetchFromAmadeusInput.endpoint}`,
          {
            ...fetchFromAmadeusInput.options,
          },
        )
      })
    })

    describe('Error Handling', () => {
      it('should return an error when the response is not ok', async () => {
        const { fetchFromAmadeus } = await import('@/utils/api/helpers')

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve(unsuccessfulResponseData),
          }),
        ) as jest.Mock

        fetchFromAmadeusInput = {
          ...fetchFromAmadeusInput,
          options: {
            body: 'fake options body',
          },
        }

        const result = await fetchFromAmadeus(fetchFromAmadeusInput)
        expect(result).toEqual(unsuccessfulResponse)
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(
          `${mockAmadeusConfig.apiUrl}${fetchFromAmadeusInput.endpoint}`,
          {
            ...fetchFromAmadeusInput.options,
            headers: undefined,
          },
        )
        expect(console.error).toHaveBeenCalledWith(
          `[Amadeus API] Error fetching ${fetchFromAmadeusInput.endpoint}: ${unsuccessfulResponseData.errors[0].title}`,
        )
      })
      it('should return an error when the response is not ok and `detail` is missing', async () => {
        const { fetchFromAmadeus } = await import('@/utils/api/helpers')

        const unsuccessfulResponseData = {
          errors: [{ title: '', detail: '' }],
        }

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve(unsuccessfulResponseData),
          }),
        ) as jest.Mock

        const result = await fetchFromAmadeus(fetchFromAmadeusInput)

        expect(result).toEqual({
          success: false,
          message: mockMessages.FETCH_TOKEN_REQUEST_FAILED,
        })
        expect(console.error).toHaveBeenCalledWith(
          `[Amadeus API] Error fetching ${fetchFromAmadeusInput.endpoint}: Unknown error`,
        )
      })

      it('should return an error when no data is returned', async () => {
        const { fetchFromAmadeus } = await import('@/utils/api/helpers')

        unsuccessfulResponse = {
          success: false,
          message: mockMessages.FETCH_TOKEN_DATA_INVALID,
        }

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          }),
        ) as jest.Mock

        const result = await fetchFromAmadeus(fetchFromAmadeusInput)
        expect(result).toEqual(unsuccessfulResponse)
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(
          `${mockAmadeusConfig.apiUrl}${fetchFromAmadeusInput.endpoint}`,
          {
            ...fetchFromAmadeusInput.options,
            headers: undefined,
          },
        )
        expect(console.error).toHaveBeenCalledWith(
          `[Amadeus API] No data found for ${fetchFromAmadeusInput.endpoint}`,
        )
      })

      it('should return a network error when fetch fails', async () => {
        const { fetchFromAmadeus } = await import('@/utils/api/helpers')

        unsuccessfulResponse = {
          success: false,
          message: 'Network error',
        }

        global.fetch = jest.fn(() =>
          Promise.reject(new Error('Network failure')),
        ) as jest.Mock

        const result = await fetchFromAmadeus(fetchFromAmadeusInput)
        expect(result).toEqual(unsuccessfulResponse)
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(
          `${mockAmadeusConfig.apiUrl}${fetchFromAmadeusInput.endpoint}`,
          {
            ...fetchFromAmadeusInput.options,
            headers: undefined,
          },
        )
        expect(console.error).toHaveBeenCalledWith(
          `[Amadeus API] Fetch error: Error: Network failure`,
        )
      })
    })
  })
})
