import React, { useMemo } from "react";
import "./ResultsPage.css";
import type { Stores } from "./schemas/stores.type";

type RawItem = {
  ingredientId: string;
  unit_of_measure: string;
  quantity: number;
  price: number | null;  
};

type RawStore = {
  name: string;
  items: [{
    ingredientId: string;
    unit_of_measure: string;
    quantity: number;
    price: number | null;  
  }]

};

export type ResultsJson = Stores;

type Props = {
  data: ResultsJson;
  onBack?: () => void;
  githubUrl?: string;
};

function normalizeKey(s: string) {
  return s.trim().toLowerCase();
}

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

type NormalizedQty =
  | { kind: "weight"; amount: number }
  | { kind: "volume"; amount: number }
  | { kind: "count"; amount: number }
  | null;

function normalizeQuantity(unit: string | null, quantity: number | null): NormalizedQty {
  if (!unit || quantity == null || quantity <= 0) return null;

  const u = unit.trim().toLowerCase();

  if (u === "g" || u === "gram" || u === "grams") return { kind: "weight", amount: quantity };
  if (u === "kg" || u === "kilogram" || u === "kilograms") return { kind: "weight", amount: quantity * 1000 };
  if (u === "oz" || u === "ounce" || u === "ounces") return { kind: "weight", amount: quantity * 28.349523125 };
  if (u === "lb" || u === "lbs" || u === "pound" || u === "pounds") return { kind: "weight", amount: quantity * 453.59237 };

  if (u === "ml" || u === "milliliter" || u === "milliliters") return { kind: "volume", amount: quantity };
  if (u === "l" || u === "liter" || u === "liters") return { kind: "volume", amount: quantity * 1000 };

  if (u === "each" || u === "ea" || u === "count" || u === "ct" || u === "pcs" || u === "pc") {
    return { kind: "count", amount: quantity };
  }

  return null;
}

function getUnitPrice(item: RawItem) {
  if (item.price == null) return null;
  const n = normalizeQuantity(item.unit_of_measure, item.quantity);
  if (!n) return null;
  return { kind: n.kind, unitPrice: item.price / n.amount };
}

function computeStoreTotal(store: RawStore) {
  return store.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
}

function computeCheapestByIngredient(stores: RawStore[]) {
  const cheapest = new Map<
    string,
    { storeKey: string; kind: "weight" | "volume" | "count"; unitPrice: number }
  >();

  for (const store of stores) {
    const storeKey = normalizeKey(store.name);

    for (const item of store.items) {
      const up = getUnitPrice(item);
      if (!up) continue;

      const ingredientKey = normalizeKey(item.ingredientId);
      const current = cheapest.get(ingredientKey);

      if (!current || (current.kind === up.kind && up.unitPrice < current.unitPrice)) {
        cheapest.set(ingredientKey, {
          storeKey,
          kind: up.kind,
          unitPrice: up.unitPrice,
        });
      }
    }
  }

  return cheapest;
}

export default function ResultsPage({
  data,
  onBack,
  githubUrl = "https://github.com/<your-user-or-org>/<your-repo>",
}: Props) {
  const cheapestByIngredient = useMemo(
    () => computeCheapestByIngredient(data.stores),
    [data.stores]
  );

  // Sort stores by total price (lowest → highest)
  const sortedStores = useMemo(() => {
    return [...data.stores]
      .map((store) => ({ store, total: computeStoreTotal(store) }))
      .sort((a, b) => a.total - b.total)
      .map((x) => x.store);
  }, [data.stores]);

  const handleBack = () => {
    if (onBack) return onBack();
    window.history.back();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Grocery Price Results",
          url: githubUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(githubUrl);
      alert("GitHub link copied!");
    } catch {
      prompt("Copy this link:", githubUrl);
    }
  };

  return (
    <div className="rp">
      <header className="rp__topbar">
        <button className="rp__btn rp__btn--ghost" onClick={handleBack}>
          ← Back
        </button>
        <div className="rp__title">Results</div>
        <button className="rp__btn" onClick={handleShare}>
          Share
        </button>
      </header>

      <main className="rp__content">
        <div className="rp__stores">
          {sortedStores.map((store, sIdx) => {
            const storeKey = normalizeKey(store.name);
            const total = computeStoreTotal(store);

            return (
              <section key={`${storeKey}-${sIdx}`} className="rp__storeCard">
                <div className="rp__storeHeader">
                  <div className="rp__storeName">{store.name}</div>
                  <div className="rp__storeTotal">{money(total)}</div>
                </div>

                <div className="rp__table">
                  <div className="rp__row rp__row--head">
                    <div>Item</div>
                    <div className="rp__cell rp__cell--qty rp__cell--head">Qty</div>
                    <div className="rp__cell rp__cell--price rp__cell--head">Price</div>
                  </div>

                  {store.items.map((item, iIdx) => {
                    const ingredientKey = normalizeKey(item.ingredientId);
                    const cheapest = cheapestByIngredient.get(ingredientKey);
                    const up = getUnitPrice(item);

                    const isMissing =
                      item.price == null ||
                      item.quantity == null ||
                      item.unit_of_measure == null;

                    const isCheapest =
                      up != null &&
                      cheapest != null &&
                      cheapest.storeKey === storeKey &&
                      cheapest.kind === up.kind &&
                      Math.abs(up.unitPrice - cheapest.unitPrice) < 1e-6; // less strict

                    return (
                      <div
                        key={`${ingredientKey}-${iIdx}`}
                        className={[
                          "rp__row",
                          isMissing ? "rp__row--missing" : "",
                          isCheapest ? "rp__row--cheapest" : "",
                        ].join(" ")}
                      >
                        <div className="rp__item">{item.ingredientId}</div>

                        <div className="rp__cell rp__cell--qty">
                          {item.quantity == null || item.unit_of_measure == null
                            ? "—"
                            : `${item.quantity} ${item.unit_of_measure}`}
                        </div>

                        <div className="rp__cell rp__cell--price">
                          {item.price == null ? "—" : money(item.price)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rp__legend">
                  <span className="rp__chip rp__chip--cheapest">
                    Cheapest (normalized)
                  </span>
                  <span className="rp__chip rp__chip--missing">Missing</span>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}