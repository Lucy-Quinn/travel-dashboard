import type { EChartsOption } from 'echarts'
import { graphic } from 'echarts'
export const optionsSkeleton: EChartsOption = {
  title: {
    text: '',
    left: 'center',
    padding: [0, 5, 30, 5],
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    name: 'City',
    data: [],
  },
  yAxis: {
    type: 'value',
    name: 'Popularity (%)',
    axisLabel: {
      formatter: '{value}%',
    },
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '10%',
    top: '10%',
    containLabel: true,
  },
  series: [
    {
      type: 'bar',
      name: 'Popularity Score',
      data: [],
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#4F46E5' },
          { offset: 1, color: '#A5B4FC' },
        ]),
        borderRadius: [5, 5, 0, 0],
      },
      animationDuration: 1500,
      animationEasing: 'cubicOut',
    },
  ],
}

export const CITY_OPTIONS = {
  BCN: 'Barcelona',
  MAD: 'Madrid',
  LON: 'London',
  NYC: 'New York City',
} as const

export const placeholder = 'Select a city'
