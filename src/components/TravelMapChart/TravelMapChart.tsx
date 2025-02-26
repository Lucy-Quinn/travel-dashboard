'use client'

import { useAmadeusFlightMap } from '@/hooks/useAmadeusFlightMap'
import * as echarts from 'echarts/core'
import { useEffect, useState } from 'react'
import { MapChartDisplay } from './MapChartDisplay'
import { MapChartForm } from './MapChartForm'

export const TravelMapChart = () => {
  const { options, fetchAndUpdateFlightMap, message, isLoading } = useAmadeusFlightMap()
  const [mapReady, setMapReady] = useState<boolean>(false)

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

  return (
    <div className="mx-auto h-full">
      <MapChartForm
        fetchAndUpdateFlightMap={fetchAndUpdateFlightMap}
        message={message}
        isLoading={isLoading}
      />
      <MapChartDisplay options={options} isLoading={isLoading} mapReady={mapReady} />
    </div>
  )
}
