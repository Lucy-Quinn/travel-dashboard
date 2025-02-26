import { CubeIcon } from '@/components/Icons'

export const EmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center text-[#1E3A8A]">
      <CubeIcon />
      <p className="text-lg font-medium">No data available</p>
      <p className="mt-1 text-sm">Please select a city to view travel data</p>
    </div>
  )
}
