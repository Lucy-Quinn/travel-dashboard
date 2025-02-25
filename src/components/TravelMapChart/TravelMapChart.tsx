'use client'

import { FormWrapper } from '@/components/Form'
import { ControlledSelect } from '@/components/Form/ControlledSelect'
import { FeedbackMessage } from '@/components/Form/FeedbackMessage'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import {
  AIRPORT_OPTIONS_PLACEHOLDER,
  CITY_AIRPORT_MAP,
  CITY_OPTIONS,
  CITY_OPTIONS_PLACEHOLDER,
} from '@/constants/travelChart'
import { useAmadeusFlightMap } from '@/hooks/useAmadeusFlightMap'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { generateAirportOptions } from './generateAirportOptions'

export const TravelMapChart = () => {
  const [mapReady, setMapReady] = useState<boolean>(false)
  const { options, fetchAndUpdateFlightMap, message, isLoading } = useAmadeusFlightMap()
  const [selectedCity, setSelectedCity] = useState<string>('')

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

  const loadChartData = async (data: FieldValues): Promise<void> => {
    try {
      await fetchAndUpdateFlightMap(data)
    } catch (error) {
      console.error('Error in loadChartData:', error)
    }
  }

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
  }

  return (
    <div>
      <FormWrapper
        onSubmit={loadChartData}
        defaultValues={{
          city: CITY_OPTIONS_PLACEHOLDER,
          ...(selectedCity && {
            airport: AIRPORT_OPTIONS_PLACEHOLDER,
          }),
        }}
      >
        {({ control }) => (
          <>
            <ControlledSelect
              control={control}
              options={CITY_OPTIONS}
              placeholder={CITY_OPTIONS_PLACEHOLDER}
              name="city"
              handleChange={handleCityChange}
            />
            {selectedCity &&
              CITY_AIRPORT_MAP[selectedCity as keyof typeof CITY_AIRPORT_MAP] && (
                <ControlledSelect
                  control={control}
                  options={generateAirportOptions(selectedCity)}
                  placeholder={AIRPORT_OPTIONS_PLACEHOLDER}
                  name="airport"
                />
              )}
            <FeedbackMessage message={message} />
          </>
        )}
      </FormWrapper>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        mapReady && (
          <ReactECharts option={options} style={{ height: '500px', width: '100%' }} />
        )
      )}
    </div>
  )
}
