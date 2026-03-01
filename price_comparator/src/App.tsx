import { useState, useMemo } from 'react'
import { GeminiComponent } from './GeminiTest'
import './App.css'

// Modules
import Location from './modules/Location'
import ShoppingList from './modules/ShoppingList'
import Chat from './modules/Chat'
import RecipeList from './modules/RecipeList'

import ResultsPage from './ResultsPage'
import sampleData from './sample.json'
import { comparePrices } from './GeminiUtility'
import type{ GridRowsProp } from '@mui/x-data-grid-pro'
import type { Ingredient } from './schemas/ingredients.type'
import type { Stores } from './schemas/stores.type'
import { useShopping } from './context/ShoppingContext'

function App() {
  const [showResults, setShowResults] = useState(false)
  const [comparisonData, setComparisonData] = useState<Stores | null>(null)
  const { rows } = useShopping();

  // share button
  const handleShare = async () => {
    const shareData = {
      title: 'Price Comparison App',
      text: 'Check out this grocery price comparison!',
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      console.error('Share failed:', err)
    }
  }


  // FIND CHEAPEST STORE PER INGREDIENT
  const cheapestByStore = useMemo(() => {
    const grouped: Record<
      string,
      { ingredient: string; unit: string; unitPrice: number; quantity: number; price: number }[]
    > = {}

    const stores = (sampleData as any)?.stores ?? []

    const bestByIngredient: Record<
      string,
      { store: string; ingredient: string; unit: string; unitPrice: number; quantity: number; price: number }
    > = {}

    stores.forEach((store: any) => {
      const storeName = store.name
      const items = store.items ?? []

      items.forEach((item: any) => {
        const ingredient = item.ingredient
        const unit = item.unit_of_measure
        const quantity = Number(item.quantity)
        const price = Number(item.price)

        if (!ingredient || !unit || quantity <= 0 || price <= 0) return

        const unitPrice = price / quantity

        const existing = bestByIngredient[ingredient]
        if (!existing || unitPrice < existing.unitPrice) {
          bestByIngredient[ingredient] = {
            store: storeName,
            ingredient,
            unit,
            unitPrice,
            quantity,
            price
          }
        }
      })
    })

    // Group winners by store
    Object.values(bestByIngredient).forEach((best) => {
      if (!grouped[best.store]) grouped[best.store] = []
      grouped[best.store].push({
        ingredient: best.ingredient,
        unit: best.unit,
        unitPrice: best.unitPrice,
        quantity: best.quantity,
        price: best.price
      })
    })

    // Sort cheapest first inside each store
    Object.keys(grouped).forEach((store) => {
      grouped[store].sort((a, b) => a.unitPrice - b.unitPrice)
    })

    // Force order: Wegmans → Costco → others
    const ordered: typeof grouped = {}

    if (grouped['Wegmans']) ordered['Wegmans'] = grouped['Wegmans']
    if (grouped['Costco']) ordered['Costco'] = grouped['Costco']

    Object.keys(grouped).forEach((store) => {
      if (store !== 'Wegmans' && store !== 'Costco') {
        ordered[store] = grouped[store]
      }
    })

    return ordered
  }, [])

  const handleGenerate = async () => {
    try {
        comparePrices(rows as Ingredient[]).then(res => {
          console.log("Received response from price comparison:", res);
          if (!res || !res.stores) {
            alert("Received invalid response from price comparison.");
            return;
          }
          setComparisonData(res);
          setShowResults(true);
        });
    } catch (error) {
        console.error("Error generating content:", error);
        alert("Failed to generate price comparison.");
    } finally {

    }    
  };

  if (showResults) {
    return (
      <ResultsPage
        data={comparisonData!}
        onBack={() => setShowResults(false)}
        githubUrl="https://github.com/<your-user-or-org>/<your-repo>"
      />
    )
  }

 
  return (
    <>
      <div className="Home">

        <div className="Top">
          <div className="LocationContainer">
            <Location />
          </div>

          <div className="Share">
            <button onClick={handleShare}>Share</button>
          </div>
        </div>
        <div className="Middle">
          <div className="ShoppingList">
            <ShoppingList />
          </div>

          <div className="PricesList">

            <button className="GenerateButton" onClick={handleGenerate} >
              Generate Price Comparison
            </button>

            <div className="CheapestPreview">
              <h3>Cheapest Items By Store</h3>

              {Object.entries(cheapestByStore).map(([store, items]) => (
                <div key={store} className="StoreGroup">
                  <h4>{store}</h4>
                  <ul>
                    {items.map((item, index) => (
                      <li key={index}>
                        {item.ingredient} — $
                        {item.unitPrice.toFixed(2)} / {item.unit}
                        <span style={{ opacity: 0.6 }}>
                          {' '}({item.quantity} {item.unit} for ${item.price.toFixed(2)})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            </div>

          </div>

          <div className="RecipeList">
            <RecipeList />
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