'use client'

import { fetchFlightInspiration } from '@/actions/flight-inspiration'
import ReactECharts from 'echarts-for-react'
import { MapChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useState } from 'react'

echarts.use([
  MapChart,
  GeoComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
])

const options = {
  title: {
    text: 'Flight Destinations',
    left: 'center',
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  },
  tooltip: {
    trigger: 'item',
  },
  visualMap: {
    type: 'continuous',
    min: 0,
    max: 100,
    text: ['High', 'Low'],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['#e0f3f8', '#2c7bb6'],
    },
  },
  series: [
    {
      type: 'map',
      map: 'world',
      roam: true,
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 1,
        areaColor: '#b3cde0',
        emphasis: {
          areaColor: '#005b96',
        },
      },
    },
  ],
}

export const TravelMapChart = () => {
  const [mapReady, setMapReady] = useState<boolean>(false)
  // const [showChart, setShowChart] = useState<boolean>(false)

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await fetch('world-map.json')
        const geoJson = await response.json()
        echarts.registerMap('world', geoJson)
        setMapReady(true)
      } catch (error) {
        console.error('Failed to load GeoJSON:', error)
      }
    }

    fetchMap()
  }, [])

  const loadChartData = async (): Promise<void> => {
    const flightData = await fetchFlightInspiration()
    console.log('🚀 ~ loadChartData ~ flightData:', flightData)
    // setShowChart(true)
    console.log('loadChartData')
  }

  return (
    <div>
      {/* <Form onSubmit={loadChartData} message={message} /> */}

      <button
        onClick={() => loadChartData()}
        className="rounded bg-blue-500 p-2 text-white"
      >
        Load Flight Data from BCN
      </button>
      {mapReady && (
        <ReactECharts option={options} style={{ height: '500px', width: '100%' }} />
      )}
    </div>
  )
}
