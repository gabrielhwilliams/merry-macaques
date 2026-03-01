import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import {
  DataGridPro,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import type{
  GridRenderCellParams,
  GridListViewColDef,
  GridColDef,
  GridRowParams,
  GridRowsProp,
  GridApiPro,
} from '@mui/x-data-grid-pro';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import {
  randomId,
} from '@mui/x-data-grid-generator';


const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180 },
  {    field: 'quantity',    headerName: 'Quantity',    width: 120,  },
  {    field: 'unit_of_measure',    headerName: 'Unit of Measure',    width: 180,  },
];

function EditAction(props: Pick<GridRowParams, 'row'>) {
  const { row } = props;
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(row.name);
  const [quantity, setQuantity] = React.useState(row.quantity);
  const [unit_of_measure, setUnitOfMeasure] = React.useState(row.unit_of_measure);
  const apiRef = useGridApiContext();

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEditing(true);
  };

  const handleClose = () => {
    setEditing(false);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    apiRef.current.updateRows([{ id: row.id, name, quantity, unit_of_measure }]);
    handleClose();
  };

  React.useEffect(() => {
    setName(row.name);
    setQuantity(row.quantity);
    setUnitOfMeasure(row.unit_of_measure);
  }, [row]);

  return (
    <React.Fragment>
      <IconButton aria-label="Edit" onClick={handleEdit}>
        <EditIcon />
      </IconButton>

      <Dialog
        open={editing}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSave,
        }}
      >
        <DialogTitle>Edit Ingredient</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <DialogContentText>
            Make changes to the ingredient information.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="quantity"
            name="quantity"
            label="Quantity"
            fullWidth
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="unit_of_measure"
            name="unit_of_measure"
            label="Unit of Measure"
            fullWidth
            value={unit_of_measure}
            onChange={(event) => setUnitOfMeasure(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function AddAction({ apiRef }: { apiRef: React.RefObject<GridApiPro | null> }) {
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState("");
  const [quantity, setQuantity] = React.useState(0);
  const [unit_of_measure, setUnitOfMeasure] = React.useState("");

  const handleOpen = () => {
    setName("");
    setQuantity(0);
    setUnitOfMeasure("");
    setEditing(true);
  };

  const handleClose = () => {
    setEditing(false);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    apiRef.current?.updateRows([{ id: randomId(), name, quantity, unit_of_measure }]);
    handleClose();
  };

  return (
    <React.Fragment>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 1,
        }}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={editing}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSave,
        }}
      >
        <DialogTitle>Add Ingredient</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <DialogContentText>
            Add an ingredient to your shopping list.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="quantity"
            name="quantity"
            label="Quantity"
            fullWidth
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
          <TextField
            required
            margin="dense"
            id="unit_of_measure"
            name="unit_of_measure"
            label="Unit of Measure"
            fullWidth
            value={unit_of_measure}
            onChange={(event) => setUnitOfMeasure(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add Ingredient</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function DeleteAction(props: Pick<GridRowParams, 'row'>) {
  const { row } = props;
  const apiRef = useGridApiContext();

  return (
    <IconButton
      aria-label="Delete"
      onClick={() => apiRef.current.updateRows([{ id: row.id, _action: 'delete' }])}
    >
      <DeleteIcon />
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
        <EditAction {...props} />
        <DeleteAction {...props} />
      </Stack>
    </Stack>
  );
}

const listViewColDef: GridListViewColDef = {
  field: 'listColumn',
  renderCell: (params) => <ListViewCell {...params} />,
};

export default function ListViewEdit({rows}: {rows: GridRowsProp}) {
  const apiRef = useGridApiRef();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 360,
        height: 400,
        position: 'relative',
      }}
    >
        <DataGridPro
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            rowHeight={64}
            listView
            listViewColumn={listViewColDef}
            hideFooter={true}
            sx={{ backgroundColor: 'background.paper' }}
        />
        <AddAction apiRef={apiRef} />
    </Box>
  );
}