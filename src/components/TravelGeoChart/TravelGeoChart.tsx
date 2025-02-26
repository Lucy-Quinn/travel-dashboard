'use client'

import { useAmadeusGeoChart } from '@/hooks/useAmadeusGeoChart'
import * as echarts from 'echarts/core'
import { useEffect, useState } from 'react'
import { GeoChartDisplay } from './GeoChartDisplay'
import { GeoChartForm } from './GeoChartForm'

export const TravelGeoChart = () => {
  const { options, fetchAndUpdateFlightMap, message, isLoading } = useAmadeusGeoChart()
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
      <GeoChartForm
        fetchAndUpdateFlightMap={fetchAndUpdateFlightMap}
        message={message}
        isLoading={isLoading}
      />
      <GeoChartDisplay options={options} isLoading={isLoading} mapReady={mapReady} />
    </div>
  )
}
