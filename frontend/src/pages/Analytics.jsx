import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Analytics() {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/analytics').then(res => setData(res.data))
  }, [])

  if (!data) return <p>Loading...</p>

  return (
    <div>
      <h2>Analytics</h2>
      <h3>By Topic</h3>
      <ul>{data.topicSummary.map(t => <li key={t.topic}>{t.topic}: {t.avgScore ?? 'N/A'}</li>)}</ul>
      <h3>By Difficulty</h3>
      <ul>{data.difficultySummary.map(d => <li key={d.difficulty}>{d.difficulty}: {d.avgScore ?? 'N/A'}</li>)}</ul>
      <h3>Progress</h3>
      <ul>{data.progress.map(p => <li key={p.month}>{p.month}: {p.avgScore ?? 'N/A'}</li>)}</ul>
    </div>
  )
}
