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
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      const { value, name, componentSubType } = params as Params

      if (componentSubType === 'scatter') {
        const price = value ? value[2] : 0
        const { airportName, cityName } = formatLocationName(String(name))
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
        areaColor: '#005b96',
      },
    },
  },
  // visualMap: {
  //   type: 'continuous',
  //   min: 0,
  //   max: 100,
  //   text: ['High', 'Low'],
  //   realtime: false,
  //   calculable: true,
  //   inRange: {
  //     color: ['#e0f3f8', '#2c7bb6'],
  //   },
  // },
  series: [
    {
      type: 'scatter', // City points/markers (shows prices)
      coordinateSystem: 'geo',
      symbolSize: 8,
      // itemStyle: {
      //   color: '#ff4d4f',
      // },
      label: {
        show: true,
        position: 'right',
        formatter: (params) => {
          const { name = '' } = params as Params
          const { airportName } = formatLocationName(String(name))
          return airportName
        },
        fontSize: 12,
      },
      data: [],
    },
    {
      type: 'lines', // Flight routes (connections between points)
      coordinateSystem: 'geo',
      effect: {
        show: true,
        period: 6,
        trailLength: 0.7,
        symbol: 'arrow',
        symbolSize: 3,
      },
      lineStyle: {
        color: '#1890ff',
        width: 1,
        opacity: 0.6,
        curveness: 0.2,
      },
      data: [],
    },
  ],
}
