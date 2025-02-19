import { CubeIcon } from '@/components/Icons'

export const EmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center">
      <CubeIcon />
      <p className="text-lg font-medium text-gray-500">No data available</p>
      <p className="mt-1 text-sm text-gray-400">
        Please select a city to view travel data
      </p>
    </div>
  )
}
