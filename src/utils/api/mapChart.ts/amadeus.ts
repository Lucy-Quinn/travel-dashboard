import { getAmadeusToken } from './getAmadeusToken'
import { getDestinationLocations } from './getDestinationLocations'
import { getFlightInspiration } from './getFlightInspiration'
import { getOriginCityLocation } from './getOriginCityLocation'

export const getFlightInspirationWithLocations = async (originCity: string) => {
  console.log(
    `[Amadeus API] Starting flight inspiration with locations search from origin: ${originCity}`,
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
    originCity,
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
    success: originCityLocationSuccess,
    data: originCityData,
    message: originCityLocationMessage,
  } = await getOriginCityLocation({
    originCity,
    flightData: flightInspirationData,
    token,
  })

  if (!originCityLocationSuccess || originCityData === undefined) {
    console.error(
      '[Amadeus API] Error fetching origin city location:',
      originCityLocationMessage,
    )
    return { success: originCityLocationSuccess, message: originCityLocationMessage }
  }

  const flightDataWithoutOrigin = flightInspirationData.filter(
    (flight) => flight.iataCode !== originCity,
  )
  const {
    success: destinationLocationsSuccess,
    data: destinationLocationsData,
    message: destinationLocationsMessage,
  } = await getDestinationLocations({
    flightData: flightDataWithoutOrigin,
    token,
  })

  if (!destinationLocationsSuccess || !destinationLocationsData) {
    console.error(
      '[Amadeus API] Error fetching destination locations:',
      destinationLocationsMessage,
    )
    return { success: destinationLocationsSuccess, message: destinationLocationsMessage }
  }

  const flightDataWithLocations = [originCityData, ...destinationLocationsData]
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
