import { mapChartSchema } from '@/schemas/charts'
import type { FlightDestinationWithPrice } from '@/types/amadeus'
import { toCamelCase } from '@/utils/formatters/nameFormatters'
import cloneDeep from 'lodash/cloneDeep'

interface FormatFlightMapProps {
  flightData: FlightDestinationWithPrice[]
  cityOrigin: string
}

export const formatFlightMap = ({ flightData, cityOrigin }: FormatFlightMapProps) => {
  const mapSchemaOptions = cloneDeep(mapChartSchema)

  const { geoCode: { latitude, longitude } = { latitude: 0, longitude: 0 } } =
    flightData.find(({ iataCode }) => iataCode === cityOrigin) ?? {}
  const originCityCoordinates = [longitude, latitude]

  const formattedData = flightData.reduce((acc, curr) => {
    const {
      iataCode,
      total,
      airportName,
      geoCode: { latitude, longitude },
      cityName,
    } = curr

    const coordinates = [longitude, latitude]

    if (iataCode === cityOrigin) {
      // Origin city
      // @ts-expect-error - This is a valid series index
      acc.title.text = `Flight Destinations with prices from ${toCamelCase(cityName)}`
      // @ts-expect-error - This is a valid series index
      acc.series?.[0].data.push({
        name: `${airportName} (${cityName})`,
        value: [...coordinates],
        itemStyle: {
          color: '#1E3A8A',
        },
        symbolSize: 10,
      })
    } else {
      // Destination cities
      // @ts-expect-error - This is a valid series index
      acc.series?.[0].data.push({
        name: `${airportName} AIRPORT (${cityName})`,
        value: [...coordinates, total],
        symbolSize: 8,
      })
      // Flight routes
      // @ts-expect-error - This is a valid series index
      acc.series?.[1].data.push({
        coords: [originCityCoordinates, coordinates],
        value: total,
      })
    }

    return acc
  }, mapSchemaOptions)

  return formattedData
}
