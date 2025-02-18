import { TravelBarChart } from '@/components/TravelBarChart'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 flex items-center justify-center gap-2 text-3xl font-bold">
        <span role="img" aria-label="chart">
          📊
        </span>
        Travel Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <TravelBarChart />
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-center text-lg font-medium">Chart 2</h2>
        </div>
      </div>
    </div>
  )
}
