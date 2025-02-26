import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type UseFormHandleSubmit,
} from 'react-hook-form'

interface ControlledSelectProps<T extends FieldValues> {
  control: Control<T>
  options: Record<string, string>
  placeholder: string
  name: string
  handleChange?: (value: string) => void
  handleSubmit?: UseFormHandleSubmit<FieldValues>
  processForm?: (data: FieldValues) => void
}

export const ControlledSelect = <T extends FieldValues>({
  control,
  options,
  placeholder,
  name,
  handleChange,
  handleSubmit,
  processForm,
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
            // Allow for custom handling of the select value - this is used for the map chart
            if (handleChange) {
              handleChange(value)
            }
            // Allow for form submission when the select is changed - this is used for the bar chart
            if (handleSubmit && processForm) {
              handleSubmit(processForm)()
            }
          }}
        >
          <div className="relative z-10 text-sm">
            <ListboxButton className="button dropdown-button flex w-full justify-center">
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
