import { mapChartSchema } from '@/schemas/charts'
import type { FlightDestinationWithPrice } from '@/types/amadeus'

interface FormatFlightMapProps {
  flightData: FlightDestinationWithPrice[]
  cityOrigin: string
}

export const formatFlightMap = ({ flightData, cityOrigin }: FormatFlightMapProps) => {
  const mapSchemaOptions = JSON.parse(JSON.stringify(mapChartSchema))

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
      acc.series[0].data.push({
        name: `${airportName} (${cityName})`,
        value: [...coordinates, 0],
        itemStyle: {
          color: '#ff4d4f',
        },
        symbolSize: 10,
      })
    } else {
      // Destination cities
      acc.series[0].data.push({
        name: `${airportName} AIRPORT (${cityName})`,
        value: [...coordinates, total],
        symbolSize: 8,
      })

      // Flight routes
      acc.series[1].data.push({
        coords: [originCityCoordinates, coordinates],
        value: total,
      })
    }
    return acc
  }, mapSchemaOptions)

  return formattedData
}
