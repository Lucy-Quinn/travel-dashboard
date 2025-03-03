import { formatLocationName } from '@/utils/formatters/nameFormatters'

export interface FormatFlightPriceLabelProps {
  value?: [number, number, string?]
  name: string
}

export const formatFlightPriceLabel = ({ value, name }: FormatFlightPriceLabelProps) => {
  if (!name) return ''
  const { airportName, cityName } = formatLocationName(String(name))

  const price = value && value[2] ? value[2] : ''

  const departureLocationLabel = `${airportName} (${cityName})`
  const destinationLocationLabel = `${airportName} (${cityName}): €${price}`

  return price ? destinationLocationLabel : departureLocationLabel
}
