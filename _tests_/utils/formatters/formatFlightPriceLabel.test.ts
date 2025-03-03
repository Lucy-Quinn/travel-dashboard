import {
  formatFlightPriceLabel,
  type FormatFlightPriceLabelProps,
} from '@/utils/formatters'
import { formatLocationName } from '@/utils/formatters/nameFormatters'

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
    input = createTestInput()
    ;(formatLocationName as jest.Mock).mockReturnValue({
      airportName,
      cityName,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('General Formatting', () => {
    it('should return the correctly formatted flight price label', () => {
      const result = formatFlightPriceLabel(input)
      expect(result).toEqual(`${airportName} (${cityName}): €${price}`)
    })
    it('should return the correctly formatted flight price label when price is 0', () => {
      input = {
        ...input,
        value: [100, 200, '0'],
      }
      const result = formatFlightPriceLabel(input)
      expect(result).toStrictEqual(`${airportName} (${cityName}): €0`)
    })

    it('should return the correctly formatted flight price label when price is missing', () => {
      input = {
        ...input,
        value: [100, 200],
      }
      const result = formatFlightPriceLabel(input)
      expect(result).toStrictEqual(`${airportName} (${cityName})`)
    })
  })

  describe('formatLocationName Calls', () => {
    it('should call formatLocationName once', () => {
      formatFlightPriceLabel(input)
      expect(formatLocationName).toHaveBeenCalledTimes(1)
    })
    it('should call formatLocationName with the correct arguments', () => {
      formatFlightPriceLabel(input)
      expect(formatLocationName).toHaveBeenCalledWith(cityName)
    })

    it('should not call formatLocationName if name is missing', () => {
      input = {
        ...input,
        name: '',
      }
      formatFlightPriceLabel(input)
      expect(formatLocationName).toHaveBeenCalledTimes(0)
    })
  })

  describe('Edge Cases', () => {
    it('should return an empty string when name is an empty string', () => {
      input = {
        ...input,
        name: '',
      }
      const result = formatFlightPriceLabel(input)
      expect(result).toStrictEqual(``)
    })
    it('should handle input with empty values  gracefully', () => {
      input = {
        name: '',
      }
      const result = formatFlightPriceLabel(input)
      expect(result).toStrictEqual(``)
    })
  })
})
