import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SignupReferral from './pages/SignupReferral'

// Protected Pages
import Dashboard from './pages/Dashboard'
import Links from './pages/Links'
import Wallet from './pages/Wallet'
import Partnership from './pages/Partnership'
import Profile from './pages/Profile'
import Support from './pages/Support'

// Static Pages
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-referral" element={<SignupReferral />} />
        
        {/* Static Pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/links" element={
          <ProtectedRoute>
            <Links />
          </ProtectedRoute>
        } />
        <Route path="/wallet" element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        } />
        <Route path="/partnership" element={
          <ProtectedRoute>
            <Partnership />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/support" element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
