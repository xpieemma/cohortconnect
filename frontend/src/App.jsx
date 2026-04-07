import { Route, Routes, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import { useUser } from './context/UserContext'
// import ProjectDetail from './pages/ProjectDetail'
import Loading from './components/Loading/Loading'
import ThemeToggle from "./components/ThemeToggler"
import Profile from './pages/Profile'
import OrganizationDetail from './pages/OrganizationDetails'
import CohortDetail from './pages/CohortDetails'

function App() {

  const { user } = useUser()

  return (
    <>
      <Navbar />
      <Loading />
      <main>
        {user ?
          <>
            <div className="float-right"><ThemeToggle /></div>
            <Routes>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/organization/:organizationId' element={<OrganizationDetail />} />
              <Route path='/cohort/:cohortId' element={<CohortDetail />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </>
          :
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        }
      </main>
    </>
  )
}

export default App
