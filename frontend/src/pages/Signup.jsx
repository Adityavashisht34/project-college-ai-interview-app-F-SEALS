import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Signup({ setUser }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = e => {
    e.preventDefault()
    axios.post('/auth/signup', { name, email, password }).then(res => {
      setUser(res.data)
      navigate('/')
    }).catch(err => alert(err.response?.data?.message || 'Error'))
  }

  return (
    <form onSubmit={submit}>
      <h2>Signup</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br/>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
      <button type="submit">Signup</button>
    </form>
  )
}
