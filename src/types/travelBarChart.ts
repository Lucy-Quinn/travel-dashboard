import { CITY_OPTIONS } from '@/constants/TravelBarChart'

export type MessageState =
  | {
      success?: string
      error?: string
    }
  | undefined

export type CityOptionsKey = keyof typeof CITY_OPTIONS
