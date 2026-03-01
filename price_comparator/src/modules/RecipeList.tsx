import * as React from 'react';
import {
  DataGridPro,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import type{
  GridRenderCellParams,
  GridListViewColDef,
  GridColDef,
  GridRowParams,
  GridRowsProp,
} from '@mui/x-data-grid-pro';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {
  randomId,
} from '@mui/x-data-grid-generator';

import addIngredientsFromRecipe from './ShoppingList'

var rows: GridRowsProp = [
  {
    id: randomId(),
    name: "Dijon Chicken",
    description: "Chicken breasts coated in a creamy Dijon mustard sauce, served with roasted broccoli.",
    ingredientsDescription: [
      "Chicken breasts - 2 lbs \n Broccoli - 3 crowns \n Dijon Mustard - 1 cup \n Seasonings - to taste"
    ],
    ingredients: [
      {
        id: randomId(),
        name: "Chicken breasts",
        quantity: 2,
        unit_of_measure: "lbs",
      },
      {
        id: randomId(),
        name: "Broccoli",
        quantity: 3,
        unit_of_measure: "crowns",
      },
      {
        id: randomId(),
        name: "Dijon Mustard",
        quantity: 1,
        unit_of_measure: "cups",
      },
      {
        id: randomId(),
        name: "Seasonings",
        quantity: null,
        unit_of_measure: "to taste",
      },
    ]
  },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'description', headerName: 'Description', width: 120 },
  { field: 'ingredientsDescription', headerName: 'Ingredients', width: 180 },
];

function AddIngredients(props: Pick<GridRowParams, 'row'>) {
  const { row } = props;

  return (
    <IconButton
      aria-label="Add Ingredients"
      onClick={() => addIngredientsFromRecipe(row.ingredients)}
    >
      Add to Shopping List
    </IconButton>
  );
}

function ListViewCell(props: GridRenderCellParams) {
  const { row } = props;

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      <Avatar sx={{ width: 32, height: 32, backgroundColor: row.avatar }} />
      <Stack sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {row.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {row.quantity} {row.unit_of_measure}
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ gap: 0.5 }}>
        <AddIngredients {...props} />
      </Stack>
    </Stack>
  );
}

const listViewColDef: GridListViewColDef = {
  field: 'listColumn',
  renderCell: (params) => <ListViewCell {...params} />,
};

export default function ListViewEdit() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 360,
        height: 400,
      }}
    >
        <DataGridPro
            rows={rows}
            columns={columns}
            rowHeight={64}
            listView
            listViewColumn={listViewColDef}
            hideFooter={true}
            sx={{ backgroundColor: 'background.paper' }}
        />
    </div>
  );
}