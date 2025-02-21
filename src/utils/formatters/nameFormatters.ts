const toCamelCase = (str: string) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const formatLocationName = (name: string) => {
  const [airportName, cityName] = name.split('(')
  const formattedAirportName = toCamelCase(airportName.replace(/[()]/g, ''))
  const formattedCityName = toCamelCase(cityName)
  return {
    airportName: formattedAirportName,
    cityName: formattedCityName,
  }
}
