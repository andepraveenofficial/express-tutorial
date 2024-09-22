import React, { useEffect, useState } from 'react'
import axios from "axios"

const App = () => {
  const [jokes, setJokes] = useState([])

useEffect(() => {
  axios.get("http://localhost:5000/api/jokes")
  .then((response) => setJokes(response.data))
  .catch((err) => console.log(err))
}, [])

  return (
    <div>
      <h1>Jokes</h1>
      <div>
        {jokes.map((joke) => (
         <div key={joke.id} style={{border:"2px solid green", margin:"5px", padding:"5px"}}>
          <h3>{joke.title}</h3>
          <p>{joke.content}</p>
         </div>
        ))}
      </div>
    </div>
  )
}

export default App
