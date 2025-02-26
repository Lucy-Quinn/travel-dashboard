import { mapChartSchema } from '@/schemas/charts'
import type { FlightDestinationWithPrice } from '@/types/amadeus'
import { formatLocationName, toCamelCase } from '@/utils/formatters/nameFormatters'
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

    const generateMapChartTitleText = (isMobile: boolean = false) => {
      const city = toCamelCase(cityName)
      const baseText = 'Flight Destinations with prices'
      return isMobile ? `${baseText}\nfrom ${city}` : `${baseText} from ${city}`
    }

    if (iataCode === cityOrigin) {
      // Origin city
      // @ts-expect-error - This is a valid series index
      acc.title.text = generateMapChartTitleText()
      // @ts-expect-error - This is a valid series index
      acc.media[0].option.title.text = generateMapChartTitleText(true)
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

interface FormatFlightPriceLabelProps {
  value?: [number, number, number]
  name: string
}

export const formatFlightPriceLabel = ({ value, name }: FormatFlightPriceLabelProps) => {
  const { airportName, cityName } = formatLocationName(String(name))

  if (value && !value[2]) {
    return `${airportName} (${cityName})`
  }
  const price = value && value[2] ? value[2] : '0'

  return `${airportName} (${cityName}): €${price}`
}
