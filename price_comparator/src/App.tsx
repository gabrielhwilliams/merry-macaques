import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

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
