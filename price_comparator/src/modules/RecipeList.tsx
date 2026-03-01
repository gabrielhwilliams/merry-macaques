import {
  DataGridPro,
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
import Login from '@mui/icons-material/Login';
import IconButton from '@mui/material/IconButton';
import {
  randomId,
} from '@mui/x-data-grid-generator';

var rows: GridRowsProp = [
  {
    id: randomId(),
    name: "Dijon Chicken",
    description: "Chicken breasts coated in a creamy Dijon mustard sauce, served with roasted broccoli.",
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
      aria-label="Add Ingredients to Shopping List"
      // onClick={() => addIngredientsFromRecipe(row.ingredients)}
    >
      <Login sx={{ width: 32, height: 32, backgroundColor: row.avatar, transform: 'scaleX(-1)' }} />
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
        padding: '5px 0',
      }}
    >
      <Stack direction="column" sx={{ gap: 0.5 }}>
        <Avatar sx={{ width: 32, height: 32, backgroundColor: row.avatar}} />
        <AddIngredients {...props} />
      </Stack>
      <Stack sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {row.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textWrap: "wrap" }}>
          {row.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textWrap: "wrap" }}>
          {Array.isArray(row.ingredients)
            ? row.ingredients.map((item: any) => (
                <span key={item.id} style={{ display: 'block', paddingLeft: 20 }}>
                  • {item.name} - {item.quantity} {item.unit_of_measure}
                </span>
              ))
            : row.ingredientsDescription}
        </Typography>
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
        height: '100%',
      }}
    >
        <DataGridPro
            rows={rows}
            columns={columns}
            getRowHeight={() => 'auto'}
            listView
            listViewColumn={listViewColDef}
            hideFooter={true}
            sx={{ backgroundColor: 'background.paper' }}
        />
    </div>
  );
}