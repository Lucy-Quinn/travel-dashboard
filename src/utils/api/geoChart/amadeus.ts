import { getAmadeusToken } from './getAmadeusToken'
import { getDepartureLocation } from './getDepartureLocation'
import { getDestinationLocations } from './getDestinationLocations'
import { getFlightInspiration } from './getFlightInspiration'

export const getFlightInspirationWithLocations = async (
  city: string,
  airport: string,
) => {
  console.log(
    `[Amadeus API] Starting flight inspiration with locations search from origin: ${city}`,
  )

  const {
    success: tokenSuccess,
    data: token,
    message: tokenMessage,
  } = await getAmadeusToken()
  if (!tokenSuccess || !token) {
    console.error('[Amadeus API] Error fetching token:', tokenMessage)
    return { success: tokenSuccess, message: tokenMessage }
  }

  const {
    success: flightInspirationSuccess,
    data: flightInspirationData,
    message: flightInspirationMessage,
  } = await getFlightInspiration({
    city,
    airport,
    token,
  })

  if (!flightInspirationSuccess || !flightInspirationData) {
    console.error(
      '[Amadeus API] Error fetching flight inspiration:',
      flightInspirationMessage,
    )
    return { success: flightInspirationSuccess, message: flightInspirationMessage }
  }

  const {
    success: departureLocationSuccess,
    data: departureLocationData,
    message: departureLocationMessage,
  } = await getDepartureLocation({
    departureLocation: airport ? airport : city,
    flightData: flightInspirationData,
    token,
  })

  if (!departureLocationSuccess || departureLocationData === undefined) {
    console.error(
      '[Amadeus API] Error fetching departure location:',
      departureLocationMessage,
    )
    return { success: departureLocationSuccess, message: departureLocationMessage }
  }

  const flightDataWithoutDeparture = flightInspirationData.filter(
    (flight) => flight.iataCode !== departureLocationData.iataCode,
  )
  const {
    success: destinationLocationsSuccess,
    data: destinationLocationsData,
    message: destinationLocationsMessage,
  } = await getDestinationLocations({
    flightData: flightDataWithoutDeparture,
    token,
  })

  if (!destinationLocationsSuccess || !destinationLocationsData) {
    console.error(
      '[Amadeus API] Error fetching destination locations:',
      destinationLocationsMessage,
    )
    return { success: destinationLocationsSuccess, message: destinationLocationsMessage }
  }

  const flightDataWithLocations = [departureLocationData, ...destinationLocationsData]
  console.log(
    '[Amadeus API] Flight location details fetched successfully for',
    flightDataWithLocations.length,
    'flights',
  )
  return {
    success: true,
    data: flightDataWithLocations,
  }
}
