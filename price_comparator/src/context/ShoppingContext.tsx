import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { GridRowsProp } from '@mui/x-data-grid-pro';
import { randomId } from '@mui/x-data-grid-generator';

interface ShoppingContextType {
  rows: GridRowsProp;
  setRows: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
  const [rows, setRows] = useState<GridRowsProp>([
    {
      id: randomId(),
      name: "Eggs",
      quantity: 11,
      unit_of_measure: "",
    },
    {
      id: randomId(), 
      name: "Milk",
      quantity: 0,
      unit_of_measure: "Gallon",
    },
  ]);

  return (
    <ShoppingContext.Provider value={{ rows, setRows }}>
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (context === undefined) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
};
