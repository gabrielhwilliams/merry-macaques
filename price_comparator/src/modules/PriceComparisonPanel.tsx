import { useMemo } from 'react'
import { Stack, Typography } from '@mui/material'

export type PriceStoreItem = {
  ingredientId?: string
  ingredient?: string
  unit_of_measure?: string | null
  quantity?: number | null
  price?: number | null
}

export type PriceStore = {
  name: string
  items: PriceStoreItem[]
}

type CheapestItem = {
  ingredient: string
  unit: string
  unitPrice: number
  quantity: number
  price: number
}

type PriceComparisonPanelProps = {
  stores: PriceStore[]
  onGenerate: () => Promise<void> | void
  onMore: () => void
  isGenerating?: boolean
  disableMore?: boolean
}

function getIngredientName(item: PriceStoreItem): string {
  const ingredientId = item.ingredientId?.trim()
  if (ingredientId) return ingredientId

  const ingredient = item.ingredient?.trim()
  if (ingredient) return ingredient

  return ''
}

function buildCheapestByStore(stores: PriceStore[]): Record<string, CheapestItem[]> {
  const grouped: Record<string, CheapestItem[]> = {}
  const bestByIngredient: Record<string, CheapestItem & { store: string }> = {}

  stores.forEach((store) => {
    const storeName = store.name

    store.items.forEach((item) => {
      const ingredient = getIngredientName(item)
      const unit = String(item.unit_of_measure ?? '').trim()
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

  Object.keys(grouped).forEach((store) => {
    grouped[store].sort((a, b) => a.unitPrice - b.unitPrice)
  })

  const ordered: Record<string, CheapestItem[]> = {}

  if (grouped.Wegmans) ordered.Wegmans = grouped.Wegmans
  if (grouped.Costco) ordered.Costco = grouped.Costco

  Object.keys(grouped).forEach((store) => {
    if (store !== 'Wegmans' && store !== 'Costco') {
      ordered[store] = grouped[store]
    }
  })

  return ordered
}

export default function PriceComparisonPanel({
  stores,
  onGenerate,
  onMore,
  isGenerating = false,
  disableMore = false
}: PriceComparisonPanelProps) {
  const cheapestByStore = useMemo(() => buildCheapestByStore(stores), [stores])
  const hasPreview = Object.keys(cheapestByStore).length > 0

  return (
    <div className="PricesList">
      <button
        className="GenerateButton"
        disabled={isGenerating}
        onClick={() => {
          void onGenerate()
        }}
      >
        <Stack direction="row" sx={{ my: 0, width: 1, alignItems: 'center', justifyContent: 'center' }}>
          <img src="/gemini-star.png" alt="Gemini" loading="lazy" height="20" width="20" />
          <span style={{ width: 10 }} />
          <Typography variant="h6" fontWeight={500}>
            {isGenerating ? 'Generating...' : 'Generate Price Comparison'}
          </Typography>
        </Stack>
      </button>

      <div className="CheapestPreview">
        <h3>Cheapest Items By Store</h3>

        {!hasPreview && <p className="PreviewEmpty">No comparable items yet.</p>}

        {Object.entries(cheapestByStore).map(([store, items]) => (
          <div key={store} className="StoreGroup">
            <h4>{store}</h4>
            <ul>
              {items.map((item, index) => (
                <li key={`${store}-${item.ingredient}-${index}`}>
                  {item.ingredient} - ${item.unitPrice.toFixed(2)} / {item.unit}
                  <span style={{ opacity: 0.6 }}>
                    {' '}
                    ({item.quantity} {item.unit} for ${item.price.toFixed(2)})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button className="MoreButton" disabled={disableMore || isGenerating} onClick={onMore}>
        More
      </button>
    </div>
  )
}
