import {
  formatFlightPriceLabel,
  type FormatFlightPriceLabelProps,
} from '@/utils/formatters'

import { formatLocationName } from '@/utils/formatters/nameFormatters'

const mockFormatLocationName = formatLocationName
jest.mock('@/utils/formatters/nameFormatters', () => ({
  formatLocationName: jest.fn(),
}))

const cityName = 'London'
const airportName = 'London Heathrow Airport'
const price = '300'

const input: FormatFlightPriceLabelProps = {
  value: [100, 200, price],
  name: cityName,
}

const createTestInput = () => input

describe('formatFlightPriceLabel', () => {
  let input: FormatFlightPriceLabelProps
  beforeEach(() => {
    jest.resetAllMocks()

    input = createTestInput()
    ;(mockFormatLocationName as jest.Mock).mockReturnValue({
      airportName,
      cityName,
    })
  })

  describe('General Formatting', () => {
    it('should return the correctly formatted flight price label', async () => {
      const result = formatFlightPriceLabel(input)
      expect(result).toEqual(`${airportName} (${cityName}): €${price}`)
    })
    it('should return the correctly formatted flight price label when price is 0', async () => {
      input = {
        ...input,
        value: [100, 200, '0'],
      }
      const result = formatFlightPriceLabel(input)
      expect(result).toStrictEqual(`${airportName} (${cityName}): €0`)
    })

    it('should return the correctly formatted flight price label when price is missing', async () => {
      input = {
        ...input,
        value: [100, 200],
      }
      const result = formatFlightPriceLabel(input)
      expect(result).toStrictEqual(`${airportName} (${cityName})`)
    })
  })

  describe('formatLocationName Calls', () => {
    it('should call formatLocationName once', async () => {
      formatFlightPriceLabel(input)
      expect(mockFormatLocationName).toHaveBeenCalledTimes(1)
    })
    it('should call formatLocationName with the correct arguments', async () => {
      formatFlightPriceLabel(input)
      expect(mockFormatLocationName).toHaveBeenCalledWith(cityName)
    })

    it('should not call formatLocationName if name is missing', async () => {
      input = {
        ...input,
        name: '',
      }
      formatFlightPriceLabel(input)
      expect(mockFormatLocationName).toHaveBeenCalledTimes(0)
    })
  })

  describe('Edge Cases', () => {
    it('should return an empty string when name is an empty string', async () => {
      input = {
        ...input,
        name: '',
      }
      const result = formatFlightPriceLabel(input)
      expect(result).toStrictEqual(``)
    })
    it('should handle input with empty values  gracefully', async () => {
      input = {
        name: '',
      }
      const result = formatFlightPriceLabel(input)
      expect(result).toStrictEqual(``)
    })
  })
})
