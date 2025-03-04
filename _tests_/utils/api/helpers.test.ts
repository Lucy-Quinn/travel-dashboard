import type { AmadeusEndpoint } from '@/types/amadeus'

const mockAmadeusConfig = {
  clientId: 'fakeClientId',
  clientSecret: 'fakeClientSecret',
  apiUrl: 'fakeApiUrl',
}

const mockMessages = {
  FETCH_TOKEN_REQUEST_FAILED: 'Failed to fetch API endpoint.',
  FETCH_TOKEN_DATA_INVALID: 'Invalid data received from API endpoint.',
}

const mockAmadeusEndpoints = {
  TOKEN: 'token' as AmadeusEndpoint,
}

jest.mock('@/constants/serverActions', () => ({
  AMADEUS_CONFIG: mockAmadeusConfig,
  MESSAGES: mockMessages,
  AMADEUS_ENDPOINTS: mockAmadeusEndpoints,
}))

// const fetchFromAmadeusInput = {
//   endpoint: 'fakeEndpoint',
//   token: 'fakeToken',
//   options: {},
//   endpointType: mockAmadeusEndpoints.TOKEN,
// }

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
})
