import { CITY_OPTIONS, placeholder } from '@/constants/TravelBarChart'
import { CityOptionsKey } from '@/types/travelBarChart'
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
          <div className="relative z-10">
            <ListboxButton className="w-full rounded-md border bg-white p-2 shadow-sm focus:outline-none">
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
