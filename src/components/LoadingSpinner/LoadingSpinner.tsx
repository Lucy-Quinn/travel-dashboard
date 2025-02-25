export const LoadingSpinner = () => {
  return (
    <div className="flex h-full items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  )
}
