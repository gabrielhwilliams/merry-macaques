import React, { useMemo } from "react";
import "./ResultsPage.css";

type RawItem = {
  ingredient: string;
  quantity: string | null;
  price: number | null;
};

type RawStore = {
  name: string;
  items: RawItem[];
};

export type ResultsJson = {
  stores: RawStore[];
};

type Props = {
  data: ResultsJson;
  onBack?: () => void;           // wire to input page later
  githubUrl?: string;            // repo link for Share button
};

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

function computeStoreTotal(store: RawStore) {
  return store.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
}

/**
 * cheapestByIngredient: ingredientKey -> { storeKey, price }
 * ingredientKey is normalized so "Chicken" and "chicken" match.
 */
function computeCheapestByIngredient(stores: RawStore[]) {
  const cheapest = new Map<string, { storeKey: string; price: number }>();

  for (const store of stores) {
    const storeKey = slugify(store.name);

    for (const item of store.items) {
      if (item.price == null) continue;

      const ingredientKey = item.ingredient.trim().toLowerCase();
      const current = cheapest.get(ingredientKey);

      if (!current || item.price < current.price) {
        cheapest.set(ingredientKey, { storeKey, price: item.price });
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

  const handleBack = () => {
    if (onBack) return onBack();
    // placeholder until routing is set up
    window.history.back();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Grocery Price Results",
          text: "Check out this project:",
          url: githubUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(githubUrl);
      alert("GitHub link copied to clipboard!");
    } catch {
      // last resort
      prompt("Copy this GitHub link:", githubUrl);
    }
  };

  return (
    <div className="rp">
      {/* Top bar */}
      <header className="rp__topbar">
        <button className="rp__btn rp__btn--ghost" onClick={handleBack} type="button">
          ← Back
        </button>

        <div className="rp__title">Results</div>

        <button className="rp__btn" onClick={handleShare} type="button">
          Share
        </button>
      </header>

      {/* Stores grid */}
      <main className="rp__content">
        <div className="rp__stores">
          {data.stores.map((store) => {
            const storeKey = slugify(store.name);
            const total = computeStoreTotal(store);

            return (
              <section key={storeKey} className="rp__storeCard">
                <div className="rp__storeHeader">
                  <div className="rp__storeName">{store.name}</div>
                  <div className="rp__storeTotal">{money(total)}</div>
                </div>

                <div className="rp__table">
                  <div className="rp__row rp__row--head">
                    <div>Item</div>
                    <div className="rp__right">Qty</div>
                    <div className="rp__right">Price</div>
                  </div>

                  {store.items.map((item, idx) => {
                    const ingredientKey = item.ingredient.trim().toLowerCase();
                    const cheapest = cheapestByIngredient.get(ingredientKey);

                    const isMissing = item.price == null || item.quantity == null;
                    const isCheapest =
                      item.price != null &&
                      cheapest?.storeKey === storeKey &&
                      cheapest.price === item.price;

                    return (
                      <div
                        key={`${ingredientKey}-${idx}`}
                        className={[
                          "rp__row",
                          isMissing ? "rp__row--missing" : "",
                          isCheapest ? "rp__row--cheapest" : "",
                        ].join(" ")}
                        title={
                          isMissing
                            ? "Not available at this store"
                            : isCheapest
                            ? "Cheapest option for this item"
                            : ""
                        }
                      >
                        <div className="rp__item">{item.ingredient}</div>
                        <div className="rp__right">{item.quantity ?? "—"}</div>
                        <div className="rp__right">{item.price == null ? "—" : money(item.price)}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="rp__legend">
                  <span className="rp__chip rp__chip--cheapest">Cheapest</span>
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