import './App.css'

// Modules
import LocationInput from './modules/LocationInput.tsx'
import StoreSelect from './modules/StoreSelect.tsx'
import Share from './modules/Share.tsx'

function App() {
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
          <div className="Share">
            <Share />
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
      </div>
    </>
  )
}

export default App
