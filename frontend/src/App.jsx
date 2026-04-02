import { Route, Routes, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import { useUser } from './context/UserContext'
import ProjectDetail from './pages/ProjectDetail'

function App() {

  const { user } = useUser()

  return (
    <>
      <Navbar />
      <main>
        {user ?
          <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/project/:projectId' element={<ProjectDetail />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
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
