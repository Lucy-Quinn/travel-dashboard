export const toCamelCase = (str: string) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const removeParentheses = (str: string) => {
  return str.replace(/[()]/g, '')
}

export const formatLocationName = (name: string) => {
  const [airportName, cityName] = name.split('(')
  const formattedAirportName = toCamelCase(removeParentheses(airportName))
  const formattedCityName = toCamelCase(removeParentheses(cityName))
  return {
    airportName: formattedAirportName,
    cityName: formattedCityName,
  }
}
