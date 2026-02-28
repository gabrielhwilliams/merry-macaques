import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import ResultsPage from './ResultsPage'
import sampleData from './sample.json'

function App() {
  const [count, setCount] = useState(0)

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
      <div className="Top">
        <div className="Location">
          <div className="LocationStringInput">

          </div>
          <div className="StoreSelect">

          </div>
        </div>
        <div className="Share">

          <button onClick={() => setShowResults(true)}>
            Test Results (sample.json)
          </button>

        </div>
      </div>
      <div className="Middle">
        <div className="ShoppingList">

        </div>
        <div className="RescipeList">

        </div>
        <div className="PricesList">

        </div>
      </div>
      <div className="Bottom">
        <div className="Chat">
          <div className="ChatInput">

          </div>
          <div className="ChatSend">

          </div>
        </div>
      </div>
    </>
  )
}

export default App
