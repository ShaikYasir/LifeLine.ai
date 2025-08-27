import { useEffect, useState } from 'react'
import { AlertTriangle, User, Droplet, Activity } from 'lucide-react'
import { processDataset, formatDate } from '../../lib/utils.js'

const StatCard = ({ icon, label, value, subtext }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-primary-700 mb-1">{label}</p>
        <h3 className="text-2xl font-semibold text-primary-900">{value}</h3>
        <p className="text-sm text-primary-600 mt-1">{subtext}</p>
      </div>
  {icon && (() => { const IconEl = icon; return <IconEl className="w-6 h-6 text-primary-400" />; })()}
    </div>
  </div>
)

const DonorCard = ({ donor }) => (
  <div className="bg-white p-4 rounded-lg border border-primary-100">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-primary-900">{donor.name}</h3>
        <p className="text-sm text-primary-600">{donor.location}</p>
      </div>
      <span className="px-2 py-1 bg-primary-50 rounded text-sm font-medium text-primary-700">
        {donor.bloodGroup}
      </span>
    </div>
    <div className="mt-3 text-sm">
      <p className="text-primary-600">Last Donation: {formatDate(donor.lastDonation)}</p>
      <p className="text-primary-600">Status: {donor.status}</p>
      <p className="text-primary-600">Total Donations: {donor.totalDonations}</p>
    </div>
  </div>
)

export function Dashboard({ donorData }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/src/dataset/Hackathon Data.csv')
        const text = await response.text()
        const processed = processDataset(text)
        setData(processed)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    if (!donorData) {
      fetchData()
    } else {
      setData(donorData)
    }
  }, [donorData])

  if (!data) return <div className="flex items-center justify-center h-screen text-primary-600">Loading...</div>

  const { stats, donors } = data

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-900">Blood Donation Dashboard</h1>
        <p className="text-primary-600 mt-1">
          Inspiring lives through the gift of blood donation. Here's today's overview.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={User}
          label="Total Donors"
          value={stats.totalDonors}
          subtext="registered donors"
        />
        <StatCard 
          icon={Activity}
          label="Active Donors"
          value={stats.activeDonors}
          subtext="currently active"
        />
        <StatCard 
          icon={AlertTriangle}
          label="Emergency Donors"
          value={stats.emergencyDonors}
          subtext="on emergency call"
        />
        <StatCard 
          icon={Droplet}
          label="Eligible Donors"
          value={stats.eligibleDonors}
          subtext="ready to donate"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Recent Donors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {donors.slice(0, 6).map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Blood Group Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {Object.entries(stats.bloodGroups).map(([group, count]) => (
            <div key={group} className="bg-white p-4 rounded-lg border border-primary-100 text-center">
              <h3 className="text-xl font-semibold text-primary-900">{group}</h3>
              <p className="text-primary-600 mt-1">{count} donors</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
