export type Stores = {
    stores: [
        {
            name: string,
            items: [
                {
                    ingredientId: string,
                    unit_of_measure: string,
                    quantity: number,
                    price: number | null,
                }
            ]
        }
    ]
}
