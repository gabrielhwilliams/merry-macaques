import './App.css'

import LocationInput from './modules/LocationInput'
import StoreSelect from './modules/StoreSelect'
import Chat from './modules/Chat'
import { useState } from 'react'
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
      <div className="Home">
        <div className="Top">
          <div className="Location">
            <div className="LocationStringInput">
              <LocationInput />
            </div>
            <div className="StoreSelect">
              <StoreSelect />
            </div>
          </div>
          <div className="StoreSelect">

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