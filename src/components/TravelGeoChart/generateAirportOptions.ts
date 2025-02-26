import { CITY_AIRPORT_MAP } from '@/constants/travelChart'

import { AIRPORT_OPTIONS } from '@/constants/travelChart'

export const generateAirportOptions = (selectedCity: string) => {
  const airportCodes = CITY_AIRPORT_MAP[selectedCity as keyof typeof CITY_AIRPORT_MAP]

  return airportCodes?.reduce(
    (options, code) => {
      if (AIRPORT_OPTIONS[code]) {
        options[code] = AIRPORT_OPTIONS[code]
      }
      return options
    },
    {} as Record<string, string>,
  )
}
