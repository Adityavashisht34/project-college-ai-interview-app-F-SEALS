import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Interview() {
  const { id } = useParams()
  const [questions, setQuestions] = useState([])
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    axios.get(`/interviews/${id}`).then(res => setQuestions(res.data.questions))
  }, [id])

  const generateQuestion = () => {
    axios.post('/questions/generate', { interviewId: Number(id) }).then(res => {
      setQuestions(q => [...q, res.data])
    }).catch(err => alert(err.response?.data?.message || 'Error'))
  }

  const submitAnswer = (questionId) => {
    axios.post('/answers', { questionId, userResponse: answer }).then(res => {
      alert(`Score: ${res.data.score}\nFeedback: ${res.data.feedback}`)
    }).catch(err => alert(err.response?.data?.message || 'Error'))
  }

  return (
    <div>
      <h2>Interview {id}</h2>
      <button onClick={generateQuestion}>Generate Question</button>
      {questions.map(q => (
        <div key={q.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          <p><b>Q:</b> {q.questionText}</p>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} />
          <button onClick={() => submitAnswer(q.id)}>Submit Answer</button>
        </div>
      ))}
    </div>
  )
}
