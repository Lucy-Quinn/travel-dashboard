import { TravelBarChart } from '@/components/TravelBarChart'
import { TravelGeoChart } from '@/components/TravelGeoChart'
import { Header } from './Header'

export const DashBoardContent = () => {
  return (
    <div className="min-h-screen bg-gray-100 lg:p-6">
      <Header />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow-lg">
          <TravelBarChart />
        </div>

        <div className="rounded-lg bg-white shadow-lg">
          <TravelGeoChart />
        </div>
      </div>
    </div>
  )
}
