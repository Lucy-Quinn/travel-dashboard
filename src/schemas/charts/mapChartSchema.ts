import { formatLocationName } from '@/utils/formatters'
import type { EChartsOption } from 'echarts'
interface Params {
  value?: [number, number, number]
  name: string
  componentSubType: string
}

export const mapChartSchema: EChartsOption = {
  title: {
    text: 'Flight Destinations with prices',
    left: 'center',
    top: 20,
    bottom: 20,
    textStyle: {
      fontSize: 22,
      fontWeight: 'bolder',
      color: '#1E3A8A',
    },
  },
  tooltip: {
    trigger: 'item',
    borderColor: '#1E3A8A',
    borderWidth: 1,
    textStyle: {
      color: '#1E3A8A',
      fontWeight: 'bold',
    },
    formatter: function (params) {
      const { value, name, componentSubType } = params as Params
      if (componentSubType === 'scatter') {
        const { airportName, cityName } = formatLocationName(String(name))

        if (value && !value[2]) {
          return `${airportName} (${cityName})`
        }
        const price = value && value[2] ? value[2] : '0'

        return `${airportName} (${cityName}): €${price}`
      }
      if (componentSubType === 'lines') {
        return ''
      }
      return name
    },
  },
  geo: {
    map: 'world',
    roam: true,
    itemStyle: {
      borderColor: '#ffffff',
      borderWidth: 1,
      areaColor: '#b3cde0',
    },
    emphasis: {
      itemStyle: {
        areaColor: '#7fadca',
      },
      label: {
        show: false,
      },
    },
    label: {
      show: false,
    },
  },
  backgroundColor: 'rgba(245, 247, 250, 0.8)',
  series: [
    {
      type: 'scatter',
      coordinateSystem: 'geo',
      symbolSize: 8,
      itemStyle: {
        color: '#008080',
      },
      label: {
        show: true,
        position: 'right',
        formatter: (params) => {
          const { name = '' } = params as Params
          const { airportName } = formatLocationName(String(name))
          return airportName
        },
        fontSize: 14,
        color: '#1E3A8A',
        fontWeight: 'normal',
      },
      data: [],
    },
    {
      type: 'lines',
      coordinateSystem: 'geo',
      effect: {
        show: true,
        period: 6,
        trailLength: 0.7,
        symbol: 'arrow',
        symbolSize: 3,
      },
      lineStyle: {
        color: '#4c8cb5',
        width: 1,
        opacity: 0.6,
        curveness: 0.2,
      },
      data: [],
    },
  ],
}
