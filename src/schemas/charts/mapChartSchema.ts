import { formatLocationName } from '@/utils/formatters'
import type { EChartsOption } from 'echarts'

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
    formatter: function (params: any) {
      if (params.componentSubType === 'scatter') {
        const { value, name } = params
        const price = value[2]
        const { airportName, cityName } = formatLocationName(name)
        return `${airportName} (${cityName}: €${price}`
      }
      if (params.componentSubType === 'lines') {
        return ''
      }
      return params.name
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
        formatter: (params: any) => {
          const { name = '' } = params
          const { airportName } = formatLocationName(name)
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
