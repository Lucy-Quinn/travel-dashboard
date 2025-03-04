import { FormatDestinationBarChartProps } from '@/utils/formatters/charts/barChartFormatters'
import type { EChartsOption } from 'echarts-for-react'

// Mock Definitions
const mockGenerateChartHeadingText = jest.fn()
jest.mock('@/utils/formatters/charts/helpers', () => ({
  generateChartHeadingText: mockGenerateChartHeadingText,
}))

jest.mock('@/schemas/charts', () => ({
  barChartSchema: barChartSchemaSkeleton,
}))

jest.mock('@/constants/travelChart', () => ({
  CITY_OPTIONS: cityOptions,
}))

// Constants & Test Data
const barChartSchemaSkeleton: EChartsOption = Object.freeze({
  title: { text: '' },
  media: [{ option: { title: { text: '' } } }],
  xAxis: { data: [] as string[] },
  series: [{ data: [] as string[] }],
})

const cityOptions = {
  MAD: 'Madrid',
  LON: 'London',
}

const travelData = [
  {
    subtype: 'CITY',
    name: 'Barcelona',
    iataCode: 'BCN',
    geoCode: { latitude: 41.297078, longitude: 2.078464 },
    type: 'recommended-location',
    relevance: 0.97173736,
  },
  {
    subtype: 'CITY',
    name: 'Lisbon',
    iataCode: 'LIS',
    geoCode: { latitude: 38.78131, longitude: -9.13592 },
    type: 'recommended-location',
    relevance: 0.90759293,
  },
]

const city = 'MAD'

const baseText = 'Recommended destinations'
let cityName = 'Madrid'
const fullTitle = `${baseText} from ${cityOptions.MAD}`
let input: FormatDestinationBarChartProps

const createTestInput = (): FormatDestinationBarChartProps => ({
  travelData,
  city,
})

let response = {
  ...barChartSchemaSkeleton,
  title: { ...barChartSchemaSkeleton.title, text: fullTitle },
  media: [{ option: { title: { text: fullTitle } } }],
  xAxis: { ...barChartSchemaSkeleton.xAxis, data: ['Barcelona', 'Lisbon'] },
  series: [{ data: [97, 91] }],
}

describe('barChartFormatter', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    input = createTestInput()
    ;(mockGenerateChartHeadingText as jest.Mock).mockReturnValue(
      `${baseText} from ${cityName}`,
    )
  })

  describe('General Formatting', () => {
    it('should format the data for the destination recommendations bar chart', async () => {
      const { formatDestinationBarChart } = await import('@/utils/formatters')
      const result = formatDestinationBarChart(input) as EChartsOption

      expect(result).toStrictEqual(response)
      expect(result.series[0].data).toStrictEqual([97, 91])
      expect(result.media[0].option.title.text).toStrictEqual(fullTitle)
      expect(result.title.text).toStrictEqual(fullTitle)
      expect(result.xAxis.data).toStrictEqual(['Barcelona', 'Lisbon'])
    })

    it('should format correctly with only one travel data item', async () => {
      input = { travelData: [travelData[0]], city }
      response = {
        ...response,
        xAxis: { ...barChartSchemaSkeleton.xAxis, data: ['Barcelona'] },
        series: [{ data: [97] }],
      }

      const { formatDestinationBarChart } = await import('@/utils/formatters')
      const result = formatDestinationBarChart(input) as EChartsOption

      expect(result).toStrictEqual(response)
      expect(result.series[0].data).toStrictEqual([97])
      expect(result.xAxis.data).toStrictEqual(['Barcelona'])
    })
  })

  describe('generateChartHeadingText Calls', () => {
    it('should call generateChartHeadingText twice', async () => {
      const { formatDestinationBarChart } = await import('@/utils/formatters')

      formatDestinationBarChart(input)
      expect(mockGenerateChartHeadingText).toHaveBeenCalledTimes(2)
      expect(mockGenerateChartHeadingText).toHaveBeenCalledWith({
        baseText: 'Recommended destinations',
        cityName: 'Madrid',
      })
      expect(mockGenerateChartHeadingText).toHaveBeenCalledWith({
        baseText: 'Recommended destinations',
        cityName: 'Madrid',
        isMobile: true,
      })
    })

    it('should call generateChartHeadingText with different cities when input changes', async () => {
      const { formatDestinationBarChart } = await import('@/utils/formatters')
      cityName = 'London'
      input.city = 'LON'

      formatDestinationBarChart(input)

      expect(mockGenerateChartHeadingText).toHaveBeenCalledWith({
        baseText: 'Recommended destinations',
        cityName,
      })
      expect(mockGenerateChartHeadingText).toHaveBeenLastCalledWith({
        baseText: 'Recommended destinations',
        cityName,
        isMobile: true,
      })
    })
  })

  describe('Edge Cases', () => {
    it('should return the original bar chart schema given an object with empty values', async () => {
      input = { travelData: [], city: '' }
      const { formatDestinationBarChart } = await import('@/utils/formatters')
      const result = formatDestinationBarChart(input)

      expect(result).toStrictEqual(barChartSchemaSkeleton)
    })

    it('should handle an unknown city code gracefully', async () => {
      input = { travelData, city: 'UNKNOWN_CITY' }
      const { formatDestinationBarChart } = await import('@/utils/formatters')
      const result = formatDestinationBarChart(input)

      expect(result).toStrictEqual(barChartSchemaSkeleton)
    })

    it('should handle empty travelData array', async () => {
      input = { travelData: [], city }
      const { formatDestinationBarChart } = await import('@/utils/formatters')
      const result = formatDestinationBarChart(input)
      expect(result).toStrictEqual(barChartSchemaSkeleton)
    })
  })
})
