import { useState } from 'react'
import { GeminiComponent } from './GeminiTest'
import './App.css'

// Modules
import Location from './modules/Location'
import Chat from './modules/Chat'


import ResultsPage from './ResultsPage'
import sampleData from './sample.json'

function App() {
  const [showResults, setShowResults] = useState(false)

  if (showResults) {
    return (
      <ResultsPage
        data={sampleData as any}
        onBack={() => setShowResults(false)}
        githubUrl="https://github.com/<your-user-or-org>/<your-repo>"
      />
    )
  }

  return (
    <>
      <GeminiComponent />
      <div className="Home">
        <div className="Top">
          <div className="LocationContainer">
            <Location />
          </div>
          <div className="Share">

          </div>
        </div>
        <div className="Middle">
          <div className="ShoppingList">

          </div>
          <div className="RescipeList">

          </div>
          <div className="PricesList">
            <button onClick={() => setShowResults(true)}>
              Test Results (sample.json)
            </button>
          </div>
        </div>
        <div className="Bottom">
          <div className="Chat">
            <Chat />
          </div>
        </div>
      </div>
    </>
  )
}

export default App