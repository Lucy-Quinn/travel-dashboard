import type { FormatGeoChartProps } from '@/utils/formatters/charts/geoChartFormatter'
import type { EChartsOption } from 'echarts-for-react'
import type { LinesData, ScatterData, Series } from './types'

// Mocks
const mockCloneDeep = jest.fn((obj) => jest.requireActual('lodash/cloneDeep')(obj))
jest.mock('lodash/cloneDeep', () => mockCloneDeep)

const mockGenerateChartHeadingText = jest.fn()
jest.mock('@/utils/formatters/charts/helpers', () => ({
  generateChartHeadingText: mockGenerateChartHeadingText,
}))

jest.mock('@/schemas/charts', () => ({
  geoChartSchema: geoChartSchemaSkeleton,
}))

// Constants & Test Data
const geoChartSchemaSkeleton: EChartsOption = Object.freeze({
  title: { text: '' },
  tooltip: {
    trigger: 'item',
  },
  geo: {
    map: 'world',
    roam: true,
  },
  media: [{ option: { title: { text: '' } } }],
  series: [
    {
      type: 'scatter',
      coordinateSystem: 'geo',
      label: { show: true },
      data: [],
    },
    {
      type: 'lines',
      coordinateSystem: 'geo',
      data: [],
    },
  ],
})

const flightData = [
  {
    iataCode: 'MAD',
    total: '0',
    airportName: 'ADOLFO SUAREZ BARAJAS',
    geoCode: {
      latitude: 40.49195,
      longitude: -3.56944,
    },
    cityName: 'MADRID',
  },
  {
    iataCode: 'FCO',
    total: '101.19',
    airportName: 'FIUMICINO',
    geoCode: {
      latitude: 41.79362,
      longitude: 12.2525,
    },
    cityName: 'ROME',
  },
  {
    iataCode: 'PMI',
    total: '56.21',
    airportName: 'PALMA DE MALLORCA',
    geoCode: {
      latitude: 39.55,
      longitude: 2.73306,
    },
    cityName: 'PALMA DE MALLORCA',
  },
]

const city = 'MAD'

const baseText = 'Recommended destinations'
const cityName = 'Madrid'
const fullTitle = `${baseText} from ${cityName}`
let input: FormatGeoChartProps

const createTestInput = (): FormatGeoChartProps => ({
  flightData,
  city,
})

let response: EChartsOption = {
  ...geoChartSchemaSkeleton,
  title: {
    ...geoChartSchemaSkeleton.title,
    text: fullTitle,
  },
  media: [
    {
      option: {
        title: { text: fullTitle },
      },
    },
  ],
  series: [
    {
      ...geoChartSchemaSkeleton.series[0],
      data: [
        {
          name: 'ADOLFO SUAREZ BARAJAS (MADRID)',
          value: [-3.56944, 40.49195],
          itemStyle: {
            color: '#1E3A8A',
          },
          symbolSize: 10,
        },
        {
          name: 'FIUMICINO AIRPORT (ROME)',
          value: [12.2525, 41.79362, '101.19'],
          symbolSize: 8,
        },
        {
          name: 'PALMA DE MALLORCA AIRPORT (PALMA DE MALLORCA)',
          value: [2.73306, 39.55, '56.21'],
          symbolSize: 8,
        },
      ],
    } as ScatterData,
    {
      ...geoChartSchemaSkeleton.series[1],
      data: [
        {
          coords: [
            [-3.56944, 40.49195],
            [12.2525, 41.79362],
          ],
          value: '101.19',
        } as LinesData,
        {
          coords: [
            [-3.56944, 40.49195],
            [2.73306, 39.55],
          ],
          value: '56.21',
        } as LinesData,
      ],
    },
  ],
}

describe('geoChartFormatter', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    input = createTestInput()
    ;(mockGenerateChartHeadingText as jest.Mock).mockReturnValue(
      `${baseText} from ${cityName}`,
    )
  })

  describe('General Formatting', () => {
    it('should format the data for the geo chart', async () => {
      const { formatGeoChart } = await import('@/utils/formatters')

      const result = formatGeoChart(input) as EChartsOption

      expect(result).toStrictEqual(response)
      expect(result.title.text).toStrictEqual(fullTitle)
      expect(result.media[0].option.title.text).toStrictEqual(fullTitle)
      expect(result.series[0].data.length).toStrictEqual(3)
      expect(result.series[1].data.length).toStrictEqual(2)
      expect(result.series[0].data[0].name).toStrictEqual(
        'ADOLFO SUAREZ BARAJAS (MADRID)',
      )
      expect(result.series[0].data[1].name).toStrictEqual('FIUMICINO AIRPORT (ROME)')
      expect(result.series[0].data[2].name).toStrictEqual(
        'PALMA DE MALLORCA AIRPORT (PALMA DE MALLORCA)',
      )
      expect(result.series[0].data[0].value).toStrictEqual([-3.56944, 40.49195])
      expect(result.series[0].data[1].value).toStrictEqual([12.2525, 41.79362, '101.19'])
      expect(result.series[0].data[2].value).toStrictEqual([2.73306, 39.55, '56.21'])
      expect(result.series[1].data[0].value).toStrictEqual('101.19')
      expect(result.series[1].data[1].value).toStrictEqual('56.21')
    })

    it('should format correctly with only one destination', async () => {
      input = {
        flightData: [flightData[0], flightData[1]],
        city,
      }

      response = {
        ...response,
        series: response.series.map(
          (series: Series<ScatterData | LinesData>, index: number) => {
            if (index === 0) {
              return {
                ...series,
                data: (series.data as ScatterData[]).filter(
                  (item) =>
                    'name' in item &&
                    item.name !== 'PALMA DE MALLORCA AIRPORT (PALMA DE MALLORCA)',
                ),
              }
            } else if (index === 1) {
              return {
                ...series,
                data: (series.data as LinesData[]).filter(
                  (item) => 'coords' in item && item.value !== '56.21',
                ),
              }
            }
            return series
          },
        ),
      }

      const { formatGeoChart } = await import('@/utils/formatters')
      const result = formatGeoChart(input) as EChartsOption
      expect(result).toStrictEqual(response)
      expect(result.series[0].data.length).toStrictEqual(2)
      expect(result.series[1].data.length).toStrictEqual(1)
    })

    it('should return the original geo chart schema given flightData with no origin city', async () => {
      input = {
        flightData: [flightData[1], flightData[2]],
        city,
      }

      const { formatGeoChart } = await import('@/utils/formatters')
      const result = formatGeoChart(input) as EChartsOption
      expect(result).toStrictEqual(geoChartSchemaSkeleton)
    })

    describe('cloneDeep Calls', () => {
      it('should call cloneDeep once if flightData and the city are not empty values', async () => {
        const { formatGeoChart } = await import('@/utils/formatters')

        formatGeoChart(input)
        expect(mockCloneDeep).toHaveBeenCalledTimes(1)
        expect(mockCloneDeep).toHaveBeenCalledWith(geoChartSchemaSkeleton)
      })

      it('should call cloneDeep zero times if flightData and the city are empty values', async () => {
        const { formatGeoChart } = await import('@/utils/formatters')
        input = { flightData: [], city: '' }
        formatGeoChart(input)
        expect(mockCloneDeep).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('generateChartHeadingText Calls', () => {
    it('should call generateChartHeadingText twice', async () => {
      const { formatGeoChart } = await import('@/utils/formatters')

      formatGeoChart(input)
      expect(mockGenerateChartHeadingText).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge Cases', () => {
    it('should return the original geo chart schema given an object with empty values', async () => {
      input = {
        flightData: [],
        city: '',
      }
      const { formatGeoChart } = await import('@/utils/formatters')
      const result = formatGeoChart(input)

      expect(result).toStrictEqual(geoChartSchemaSkeleton)
    })

    it('should handle empty flightData array', async () => {
      input = { flightData: [], city }
      const { formatGeoChart } = await import('@/utils/formatters')
      const result = formatGeoChart(input)
      expect(result).toStrictEqual(geoChartSchemaSkeleton)
    })
  })
})
