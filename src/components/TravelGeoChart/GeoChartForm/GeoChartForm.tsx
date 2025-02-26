import { CITY_AIRPORT_MAP } from '@/constants/travelChart'

import { CITY_OPTIONS } from '@/constants/travelChart'

import { AIRPORT_OPTIONS_PLACEHOLDER } from '@/constants/travelChart'

import { ControlledSelect } from '@/components/Form/ControlledSelect'
import { FeedbackMessage } from '@/components/Form/FeedbackMessage'
import { FormWrapper } from '@/components/Form/FormWrapper'
import { CITY_OPTIONS_PLACEHOLDER } from '@/constants/travelChart'
import { MessageState } from '@/types/travelChart'
import { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { generateAirportOptions } from '../generateAirportOptions'

interface GeoChartFormProps {
  fetchAndUpdateFlightMap: (data: FieldValues) => Promise<void>
  message: MessageState
  isLoading: boolean
}

export const GeoChartForm = ({
  fetchAndUpdateFlightMap,
  message,
  isLoading,
}: GeoChartFormProps) => {
  const [selectedCity, setSelectedCity] = useState<string>('')

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
  )
}
