export const LoadingSpinner = () => {
  return (
    <div className="text-primary-blue flex h-full items-center justify-center py-8">
      <div className="border-primary-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  )
}
