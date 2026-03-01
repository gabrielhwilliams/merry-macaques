import { useMemo, useState } from 'react'
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

type SampleItem = {
  ingredient?: string
  ingredientId?: string
  unit_of_measure?: string | null
  quantity?: number | null
  price?: number | null
}

type SampleStore = {
  name: string
  items: SampleItem[]
}

function App() {
  const [showResults, setShowResults] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [comparisonData, setComparisonData] = useState<Stores | null>(null)
  const { rows } = useShopping()

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
    if (!comparisonData?.stores) return []
    return comparisonData.stores as unknown as PriceStore[]
  }, [comparisonData])

  const fallbackResultsData = useMemo<Stores>(() => {
    const rawStores = (sampleData as { stores?: SampleStore[] }).stores ?? []

    return {
      stores: rawStores.map((store) => ({
        name: store.name,
        items: (store.items ?? []).map((item) => ({
          ingredientId: String(item.ingredientId ?? item.ingredient ?? '').trim(),
          unit_of_measure: String(item.unit_of_measure ?? ''),
          quantity: Number(item.quantity ?? 0),
          price: item.price == null ? null : Number(item.price)
        }))
      }))
    } as Stores
  }, [])

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
    setShowResults(true)
  }

  if (showResults) {
    return (
      <ResultsPage
        data={comparisonData ?? fallbackResultsData}
        onBack={() => setShowResults(false)}
        githubUrl="https://github.com/<your-user-or-org>/<your-repo>"
      />
    )
  }

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
            disableMore={false}
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
