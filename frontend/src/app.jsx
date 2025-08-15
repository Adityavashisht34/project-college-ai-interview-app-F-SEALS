import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Interview from './pages/Interview'
import Analytics from './pages/Analytics'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:5002/api'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get('/auth/me').then(res => setUser(res.data)).catch(() => {})
  }, [])

  const logout = () => {
    axios.post('/auth/logout').then(() => setUser(null))
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/analytics">Analytics</Link> |{" "}
        {!user && <Link to="/login">Login</Link>}{" "}
        {!user && <Link to="/signup">Signup</Link>}{" "}
        {user && <button onClick={logout}>Logout</button>}
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </div>
  )
}
