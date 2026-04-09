import { Route, Routes, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import { useUser } from './context/UserContext'
import Loading from './components/Loading/Loading'
import ThemeToggle from "./components/ThemeToggler"
import Profile from './pages/Profile'
import OrganizationDetail from './pages/OrganizationDetails'
import CohortDetail from './pages/CohortDetails'

function App() {
  // If your context has an isLoading property, grab it here to prevent the Auth Flash!
  // const { user, isUserLoading } = useUser(); 
  const { user } = useUser()

  return (
    <>
      <Navbar />
      <Loading />
      <main className="relative">
        
        {/*  ThemeToggle is now available to logged-out users too! */}
        <div className="absolute top-0 right-4 z-10">
          <ThemeToggle />
        </div>

        {/*  If you have a loading state, show a spinner instead of flashing the login page */}
        {/* {isUserLoading ? <p>Loading app...</p> :  */}
        
        {user ? (
          <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/organization/:organizationId' element={<OrganizationDetail />} />
            <Route path='/cohort/:cohortId' element={<CohortDetail />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}

      </main>
    </>
  )
}

export default App