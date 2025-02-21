import type { EChartsOption } from 'echarts'
import { graphic } from 'echarts'
export const barChartSchema: EChartsOption = {
  title: {
    text: '',
    left: 'center',
    textStyle: {
      lineHeight: 30,
      fontSize: 18,
    },
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: [],
    name: 'City',
    nameTextStyle: {
      fontSize: 16,
      lineHeight: 30,
    },
    axisLabel: {
      fontSize: 16,
    },
  },
  yAxis: {
    type: 'value',
    name: 'Popularity (%)',
    nameTextStyle: {
      fontSize: 16,
      lineHeight: 30,
    },
    axisLabel: {
      formatter: '{value}%',
      fontSize: 16,
    },
  },
  grid: {
    left: '5%',
    right: '10%',
    bottom: '10%',
    top: '20%',
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
  media: [
    {
      query: {
        maxWidth: 426,
      },
      option: {
        title: {
          text: '',
          textStyle: {
            lineHeight: 30,
          },
          padding: [0, 10, 20, 10],
        },
        grid: {
          top: 120,
        },
        xAxis: {
          type: 'category',
          name: 'City',
          nameRotate: 45,
          nameTextStyle: {
            fontSize: 12,
          },
          axisLabel: {
            interval: 0,
            rotate: 45,
            fontSize: 12,
          },
        },
        yAxis: {
          type: 'value',
          nameTextStyle: {
            fontSize: 12,
          },
          axisLabel: {
            fontSize: 12,
          },
        },
      },
    },
    {
      query: {
        minWidth: 426,
        maxWidth: 767,
      },
      option: {
        grid: {
          left: '5%',
          right: '10%',
        },
        xAxis: {
          type: 'category',
          name: 'City',
          nameTextStyle: {
            fontSize: 12,
          },
          axisLabel: {
            fontSize: 12,
          },
        },
        yAxis: {
          type: 'value',
          nameTextStyle: {
            fontSize: 12,
          },
          axisLabel: {
            fontSize: 12,
          },
        },
      },
    },
  ],
}
