import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = e => {
    e.preventDefault()
    axios.post('/auth/login', { email, password }).then(res => {
      setUser(res.data)
      navigate('/')
    }).catch(err => alert(err.response?.data?.message || 'Error'))
  }

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
      <button type="submit">Login</button>
    </form>
  )
}
