import { geoChartSchema } from '@/schemas/charts'
import type { FlightDestinationWithPrice } from '@/types/amadeus'
import { generateChartHeadingText } from '@/utils/formatters/charts/helpers'
import type { EChartsOption } from 'echarts-for-react'
import cloneDeep from 'lodash/cloneDeep'

export interface FormatGeoChartProps {
  flightData: FlightDestinationWithPrice[]
  city: string
}

export const formatGeoChart = ({ flightData, city }: FormatGeoChartProps) => {
  if (!flightData || !city) return geoChartSchema

  const mapSchemaOptions = cloneDeep(geoChartSchema)
  const baseText = 'Flight Destinations with prices'

  const { geoCode: { latitude = 0, longitude = 0 } = {} } =
    flightData.find(({ iataCode }) => iataCode === city) ?? {}

  if (!latitude || !longitude) return geoChartSchema

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

    if (iataCode === city) {
      // Origin city
      acc.title.text = generateChartHeadingText({
        cityName,
        baseText,
      })
      acc.media[0].option.title.text = generateChartHeadingText({
        cityName,
        baseText,
        isMobile: true,
      })
      acc.series?.[0].data.push({
        name: `${airportName} (${cityName})`,
        value: [...coordinates],
        itemStyle: { color: '#1E3A8A' },
        symbolSize: 10,
      })
    } else {
      // Destination cities
      acc.series?.[0].data.push({
        name: `${airportName} AIRPORT (${cityName})`,
        value: [...coordinates, total],
        symbolSize: 8,
      })
      // Flight routes
      acc.series?.[1].data.push({
        coords: [originCityCoordinates, coordinates],
        value: total,
      })
    }

    return acc
  }, mapSchemaOptions as EChartsOption)

  return formattedData
}
