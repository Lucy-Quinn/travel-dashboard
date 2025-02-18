'use client'
import { useAmadeusChart } from '@/hooks/useAmadeusChart'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import clsx from 'clsx'
import ReactECharts from 'echarts-for-react'
import { BarChart } from 'echarts/charts'
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { cities } from './constants'

echarts.use([BarChart, GridComponent, TitleComponent, TooltipComponent, CanvasRenderer])

export const TravelBarChart = () => {
  const { options, fetchAndUpdateChart, message, isLoading } = useAmadeusChart()
  const [showChart, setShowChart] = useState(false)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      cities: 'Select a city',
    },
  })

  const processForm = async (data: { cities: string }) => {
    fetchAndUpdateChart(data.cities)
    setShowChart(true)
  }

  return (
    <>
      <form onSubmit={handleSubmit(processForm)}>
        <Controller
          control={control}
          name="cities"
          render={({ field }) => (
            <Listbox
              value={field.value}
              onChange={(value) => {
                field.onChange(value)
                handleSubmit(processForm)()
              }}
            >
              <div className="relative z-10">
                <ListboxButton className="w-full rounded-md border bg-white p-2 shadow-sm focus:outline-none">
                  {field.value}
                </ListboxButton>
                <ListboxOptions className="absolute mt-1 w-full rounded-md border bg-white shadow-lg">
                  {cities.map((city) => (
                    <ListboxOption
                      key={city}
                      value={city}
                      className="cursor-pointer p-2 hover:bg-blue-100"
                    >
                      {city}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          )}
        />

        {message && (
          <p className={clsx(message.success ? 'text-green-600' : 'text-red-500')}>
            {message.success || message.error}
          </p>
        )}
      </form>
      <div className="h-[400px] w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : showChart ? (
          <ReactECharts option={options} style={{ height: 400, width: '100%' }} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              className="mb-4 h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <p className="text-lg font-medium text-gray-500">No data available</p>
            <p className="mt-1 text-sm text-gray-400">
              Please select a city to view travel data
            </p>
          </div>
        )}
      </div>
    </>
  )
}
