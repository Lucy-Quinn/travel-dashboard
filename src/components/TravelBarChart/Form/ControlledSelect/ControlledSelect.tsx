import { CITY_OPTIONS, placeholder } from '@/constants/TravelBarChart'
import type { CityOptionsKey } from '@/types/travelBarChart'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Control, Controller, FieldValues, UseFormHandleSubmit } from 'react-hook-form'

interface ControlledSelectProps {
  control: Control<FieldValues>
  handleSubmit: UseFormHandleSubmit<FieldValues>
  processForm: (data: FieldValues) => void
}

export const ControlledSelect = ({
  control,
  handleSubmit,
  processForm,
}: ControlledSelectProps) => {
  return (
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
          <div className="relative z-10 m-2">
            <ListboxButton className="flex w-full justify-center rounded-lg bg-black p-2 text-sm font-bold text-white shadow-sm hover:bg-black/80 focus:outline-none sm:w-4/12 md:m-auto lg:m-0 lg:ml-auto xl:text-lg">
              {CITY_OPTIONS[field.value as CityOptionsKey] || placeholder}
            </ListboxButton>
            <ListboxOptions className="absolute mt-1 w-full rounded-md border bg-white shadow-lg">
              {Object.entries(CITY_OPTIONS).map(([cityCode, cityName]) => (
                <ListboxOption
                  key={cityCode}
                  value={cityCode}
                  className="cursor-pointer p-2 hover:bg-blue-100"
                >
                  {cityName}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      )}
    />
  )
}
