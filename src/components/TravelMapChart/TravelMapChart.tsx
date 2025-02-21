'use client'

import { useAmadeusFlightMap } from '@/hooks/useAmadeusFlightMap'
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
export const TravelMapChart = () => {
  const [mapReady, setMapReady] = useState<boolean>(false)
  const { options, fetchAndUpdateFlightMap, message, isLoading } = useAmadeusFlightMap()

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
    const flightData = await fetchAndUpdateFlightMap('MAD')
    // console.log('🚀 ~ loadChartData ~ flightData:', flightData)
    // setShowChart(true)
    // console.log('loadChartData')
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
