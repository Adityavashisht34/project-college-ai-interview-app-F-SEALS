import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Dashboard({ user }) {
  const [topic, setTopic] = useState('JavaScript')
  const [difficulty, setDifficulty] = useState('Easy')
  const [interviews, setInterviews] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      axios.get('/interviews').then(res => setInterviews(res.data))
    }
  }, [user])

  const createInterview = () => {
    axios.post('/interviews', { topic, difficulty }).then(res => {
      navigate(`/interview/${res.data.id}`)
    }).catch(err => alert(err.response?.data?.message || 'Error'))
  }

  if (!user) return <p>Please login to start</p>

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <select value={topic} onChange={e => setTopic(e.target.value)}>
          <option>JavaScript</option>
          <option>DBMS</option>
          <option>Data Structures</option>
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button onClick={createInterview}>Start Interview</button>
      </div>
      <h3>Your Interviews</h3>
      <ul>
        {interviews.map(iv => (
          <li key={iv.id}>
            <Link to={`/interview/${iv.id}`}>{iv.topic} ({iv.difficulty})</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
