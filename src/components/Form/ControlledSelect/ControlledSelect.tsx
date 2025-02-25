import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface ControlledSelectProps<T extends FieldValues> {
  control: Control<T>
  options: Record<string, string>
  placeholder: string
  name: string
  handleChange?: (value: string) => void
}

export const ControlledSelect = <T extends FieldValues>({
  control,
  options,
  placeholder,
  name,
  handleChange,
}: ControlledSelectProps<T>) => {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <Listbox
          value={field.value || ''}
          onChange={(value) => {
            field.onChange(value)
            if (handleChange) {
              handleChange(value)
            }
          }}
        >
          <div className="relative z-10 m-2">
            <ListboxButton className="flex w-full justify-center rounded-lg bg-black p-2 text-sm font-bold text-white shadow-sm hover:bg-black/80 focus:outline-none sm:w-4/12 md:m-auto lg:m-0 lg:ml-auto xl:text-lg">
              {options[field.value as keyof typeof options] || placeholder}
            </ListboxButton>
            <ListboxOptions className="absolute mt-1 w-full rounded-md border bg-white shadow-lg">
              {Object.entries(options).map(([code, name]) => (
                <ListboxOption
                  key={code}
                  value={code}
                  className="cursor-pointer p-2 hover:bg-blue-100"
                >
                  {name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      )}
    />
  )
}
