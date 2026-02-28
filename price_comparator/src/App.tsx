import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import ResultsPage from './ResultsPage'
import sampleData from './sample.json'

function App() {
  const [count, setCount] = useState(0)

  const [showResults, setShowResults] = useState(false)

  const githubUrl = "https://github.com/<your-user-or-org>/<your-repo>"

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Grocery Price App",
          url: githubUrl,
        })
        return
      }
      await navigator.clipboard.writeText(githubUrl)
      alert("GitHub link copied!")
    } catch {
      prompt("Copy this link:", githubUrl)
    }
  }

  if (showResults) {
    return (
      <ResultsPage
        data={sampleData as any}
        onBack={() => setShowResults(false)}
        githubUrl={githubUrl}
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
          {/* removed the old sample test button */}
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

      {/* ✅ NEW: Bottom-right floating actions on home page */}
      <div className="HomeFab">
        <button className="HomeFabBtn HomeFabBtn--ghost" onClick={handleShare}>
          Share
        </button>
        <button className="HomeFabBtn" onClick={() => setShowResults(true)}>
          Results
        </button>
      </div>
    </>
  )
}

export default App