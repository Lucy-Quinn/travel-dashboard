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
import type { FieldValues } from 'react-hook-form'
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
    <div className="mx-auto h-full">
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
          <div>
            <div className="mx-2 mt-2 flex flex-col justify-end gap-2 md:mr-3 md:flex-row">
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

              <button type="submit" className="button submit-button" disabled={isLoading}>
                {isLoading ? 'loading...' : 'Submit'}
              </button>
            </div>
            <FeedbackMessage message={message} />
          </div>
        )}
      </FormWrapper>

      <div className="flex min-h-[300px] w-full items-center justify-center md:min-h-[400px] lg:min-h-[500px]">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          mapReady && (
            <ReactECharts
              option={options}
              className="min-h-[300px] w-full md:min-h-[500px]"
              style={{ height: '100%', width: '100%', marginTop: '20px' }}
            />
          )
        )}
      </div>
    </div>
  )
}
