import { generateChartHeadingText } from '@/utils/formatters/charts/helpers'

describe('generateChartHeadingText', () => {
  const baseText = 'Recommended destinations'
  let cityName = 'Paris'

  it('should generate the correct chart heading text for desktop', () => {
    const input = {
      cityName,
      baseText,
    }
    const result = generateChartHeadingText(input)
    expect(result).toEqual('Recommended destinations from Paris')
  })

  it('should generate the correct chart heading for mobile', () => {
    const input = {
      cityName,
      baseText,
      isMobile: true,
    }

    const result = generateChartHeadingText(input)
    expect(result).toEqual(`Recommended destinations\nfrom Paris`)
  })

  it('should handle multi-word city names correctly', () => {
    cityName = 'New York'
    const input = {
      cityName,
      baseText,
    }

    const result = generateChartHeadingText(input)
    expect(result).toEqual(`Recommended destinations from New York`)
  })

  it('should return an empty string if given an object with empty values', () => {
    const input = {
      cityName: '',
      baseText: '',
    }
    const result = generateChartHeadingText(input)
    expect(result).toEqual('')
  })

  it('should return an empty string if baseText is an empty string', () => {
    const input = {
      cityName: '',
      baseText,
    }
    const result = generateChartHeadingText(input)
    expect(result).toEqual('')
  })

  it('should return an empty string if cityName is an empty string', () => {
    const input = {
      cityName,
      baseText: '',
    }
    const result = generateChartHeadingText(input)
    expect(result).toEqual('')
  })
})
