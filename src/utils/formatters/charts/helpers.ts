import { toCamelCase } from '@/utils/formatters'

interface GenerateChartHeadingTextProps {
  cityName: string
  baseText: string
  isMobile?: boolean
}

export const generateChartHeadingText = ({
  cityName,
  baseText,
  isMobile = false,
}: GenerateChartHeadingTextProps) => {
  if (!cityName || !baseText) return ''

  const city = toCamelCase(cityName)

  return isMobile ? `${baseText}\nfrom ${city}` : `${baseText} from ${city}`
}
