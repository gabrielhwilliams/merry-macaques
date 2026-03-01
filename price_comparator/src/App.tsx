import { useState, useMemo, useEffect } from 'react'
import './App.css'

// Modules
import Location from './modules/Location'
import ShoppingList from './modules/ShoppingList'
import Chat from './modules/Chat'
import RecipeList from './modules/RecipeList'
import TopBarSection from './modules/TopBarSection'
import PriceComparisonPanel, { type PriceStore } from './modules/PriceComparisonPanel'

import ResultsPage from './ResultsPage'
import sampleData from './sample.json'
import { comparePrices } from './GeminiUtility'
import type { Ingredient } from './schemas/ingredients.type'
import type { Stores } from './schemas/stores.type'
import { useShopping } from './context/ShoppingContext'

type ShoppingRow = {
  name?: string
  quantity?: number
  unit_of_measure?: string
}

function App() {
  const [showResults, setShowResults] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [comparisonData, setComparisonData] = useState<Stores | null>(null)
  const { rows } = useShopping();

  // Remove MUI watermark whenever component updates or comparison data changes
  useEffect(() => {
    getRidOfWatermark()
  }, [])

  useEffect(() => {
    getRidOfWatermark()
  }, [comparisonData])

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

  const ingredientPayload = useMemo<Ingredient[]>(() => {
    return rows
      .map((row) => {
        const typedRow = row as ShoppingRow
        return {
          ingredientId: String(typedRow.name ?? '').trim(),
          quantity: Number(typedRow.quantity ?? 0),
          unit_of_measure: String(typedRow.unit_of_measure ?? '').trim(),
          price: null
        }
      })
      .filter((item) => item.ingredientId.length > 0 && item.quantity > 0)
  }, [rows])

  const previewStores = useMemo<PriceStore[]>(() => {
    if (comparisonData?.stores && comparisonData.stores.length > 0) {
      return comparisonData.stores as unknown as PriceStore[]
    }

    const fallbackData = sampleData as unknown as { stores?: PriceStore[] }
    return fallbackData.stores ?? []
  }, [comparisonData])

  const handleGenerate = async () => {
    if (ingredientPayload.length === 0) {
      alert('Please add at least one item with quantity before generating a comparison.')
      return
    }

    setIsGenerating(true)
    try {
      const response = await comparePrices(ingredientPayload)
      console.log('Received response from price comparison:', response)

      if (!response?.stores) {
        alert('Received invalid response from price comparison.')
        return
      }

      setComparisonData(response)
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Failed to generate price comparison.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleMore = () => {
    if (!comparisonData?.stores) {
      alert('Generate a price comparison first.')
      return
    }

    setShowResults(true)
  }

  if (showResults && comparisonData) {
    return (
      <ResultsPage
        data={comparisonData}
        onBack={() => setShowResults(false)}
        githubUrl="https://github.com/<your-user-or-org>/<your-repo>"
      />
    )
  }

  const getRidOfWatermark = () => {
    var parentdocsRaw = document.getElementsByClassName("MuiDataGrid-main");

    Array.from(parentdocsRaw).forEach((parentdoc) => {
        const watermark = Array.from(parentdoc.children).find((div) => (div as HTMLElement).innerText === "MUI X Missing license key");
        if (watermark) {
        (watermark as HTMLElement).remove();
        }
    });
  };

  return (
    <>
      <div className="Home">
        <TopBarSection onShare={handleShare}>
          <Location />
        </TopBarSection>

        <div className="Middle">
          <div className="ShoppingList">
            <ShoppingList />
          </div>

          <PriceComparisonPanel
            stores={previewStores}
            onGenerate={handleGenerate}
            onMore={handleMore}
            isGenerating={isGenerating}
            disableMore={!comparisonData?.stores}
          />

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
