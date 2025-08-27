import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Layout } from './components/layout'
import { Header } from './components/layout/Header'
import { Dashboard } from './components/dashboard/Dashboard'
import Donors from './components/donors/Donors'
import DonorProfile from './components/donors/DonorProfile'
import Bridges from './components/bridges/Bridges'
import Rewards from './components/rewards/Rewards'
import Emergencies from './components/emergencies/Emergencies'
import { processDataset } from './lib/utils.js'
import dataCsv from './dataset/Hackathon Data.csv?raw'
import './App.css'
import RoleGuard from './auth/RoleGuard'
import About from './components/about/About'
import { useUser } from '@clerk/clerk-react'
import RegisterDonorForm from './components/donors/RegisterDonorForm'
import Prevention from './components/prevention/Prevention'
import UserStats from './components/stats/UserStats'
import LoadingScreen from './components/common/LoadingScreen'

function App() {
  const [donorData, setDonorData] = useState(null);
  const { isSignedIn, isLoaded, user } = useUser()

  useEffect(() => {
    try {
      const processed = processDataset(dataCsv);
      setDonorData(processed);
    } catch (error) {
      console.error('Error processing donor data:', error);
    }
  }, []);

  // After login, push any locally stored pending registration into Clerk if not already present (store in unsafeMetadata)
  useEffect(() => {
    if (isSignedIn && user && isLoaded) {
      const pending = localStorage.getItem('pendingRegistration')
      const hasProfile = user.publicMetadata?.donorProfile || user.unsafeMetadata?.donorProfile
      if (pending && !hasProfile) {
        try {
          const parsed = JSON.parse(pending)
          user.update({ unsafeMetadata: { ...user.unsafeMetadata, donorProfile: parsed, role: user.unsafeMetadata?.role || user.publicMetadata?.role || 'User' }})
            .then(() => localStorage.removeItem('pendingRegistration'))
            .catch(err => console.error('Failed to sync pending registration', err))
        } catch (e) {
          console.error('Invalid pending registration JSON', e)
        }
      }
    }
  }, [isSignedIn, user, isLoaded])

  if (!isLoaded) {
    return <LoadingScreen />
  }

  if (!isSignedIn) {
    return (
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/register-donor" element={<RegisterDonorForm />} />
              <Route path="/prevention" element={<Prevention />} />
              <Route path="/emergencies" element={<Emergencies donorData={donorData} />} />
              <Route path="*" element={<About />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    )
  }

  return (
      <BrowserRouter>
    <Layout>
          <Routes>
            <Route path="/about" element={<About />} />
            {/* Dashboard now Admin-only */}
            <Route path="/" element={<RoleGuard roles={['Admin']}><Dashboard donorData={donorData} setDonorData={setDonorData} /></RoleGuard>} />
            <Route path="/donors" element={<RoleGuard roles={['Admin','User']}><Donors donorData={donorData} /></RoleGuard>} />
            <Route path="/prevention" element={<Prevention />} />
            <Route path="/bridges" element={<RoleGuard roles={['Admin','User']}><Bridges donorData={donorData} /></RoleGuard>} />
            <Route path="/donors/:id" element={<RoleGuard roles={['Admin','User']}><DonorProfile donorData={donorData} /></RoleGuard>} />
            <Route path="/rewards" element={<RoleGuard roles={['Admin','User']}><Rewards donorData={donorData} /></RoleGuard>} />
            <Route path="/stats" element={<RoleGuard roles={['User']}><UserStats donorData={donorData} currentUser={user} /></RoleGuard>} />
            <Route path="/emergencies" element={<RoleGuard roles={['Admin','User']}><Emergencies donorData={donorData} /></RoleGuard>} />
            <Route path="*" element={<About />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    )
}

export default App